import React, { Component } from 'react';
import {Container, Row,Col, Button, Table, Form, Modal} from 'react-bootstrap'
import axios from 'axios';

//Components
import Nav from '../components/Nav';
import Overlay from '../components/Overllay';

class Home extends Component{

    constructor(props) {
        super(props)
        this.state = {
            editId : null,
            dataSource :[],
            modalShow: false,
            nameValue :'',
            shopName :'',
            status :'',
            loading: false
        }

        this.showCreateForm = this.showCreateForm.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this)
        this.shopNameChangeHandler = this.shopNameChangeHandler.bind(this)
        this.statusChangeHandler = this.statusChangeHandler.bind(this)
        this.saveFormHandler  = this.saveFormHandler.bind(this)
        this.editHandler = this.editHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.refreshList = this.refreshList.bind(this)
        this.reset = this.reset.bind(this)
    }

    componentDidMount(){
        this.refreshList();
    }

    showCreateForm(value){
        this.setState({modalShow: value})
        this.reset();
        this.refreshList();
    }

    saveFormHandler(e) {
        e.preventDefault();
       let data = {id: "null", "name": this.state.nameValue, "shopname": this.state.shopName, "status": this.state.status}
       this.setState({loading: true})
        if(this.state.editId){
            data['id'] = this.state.editId;
            axios.put(`https://shop-management-777.herokuapp.com/api/shop/${data.id}`, data )
            .then(res => {
              this.setState({loading: false})
              this.refreshList();
              this.reset()
            })
        }else{
            axios.post(`https://shop-management-777.herokuapp.com/api/create`, data)
            .then(res => {
            this.setState({loading: false})
              this.refreshList();
              this.reset()
            })
        }
        console.log(this.state);
        // console.log(this.refs.name.getDOMNode())
    }

    nameChangeHandler(e){
        this.setState({nameValue: e.target.value})
    }

    shopNameChangeHandler(e) {
        this.setState({shopName: e.target.value})
    }

    statusChangeHandler(e){
        this.setState({status: e.target.value})
    }

    editHandler(e) {
        console.log(e);
        this.setState({editId: e.id,nameValue: e.name, shopName: e.shopname, state: e.status, modalShow: true})
    }

    deleteHandler(e) {
        this.setState({editId: e.id})
        this.setState({loading: true})
        axios.delete(`https://shop-management-777.herokuapp.com/api/shop/${e.id}`)
      .then(res => {
        this.setState({loading: false})
        this.reset()
        this.refreshList();
      })
    }

    refreshList() {
        this.setState({loading: true})
        axios.get(`https://shop-management-777.herokuapp.com/api/list`)
        .then(res => {
            this.setState({loading: false})
          const dataSource = res.data;
          this.setState({ dataSource :dataSource.items});
        })
    }

    reset() {
        this.setState({editId: null,nameValue: '', shopName: '', state: ''})
    }

    render(){
        let row = this.state.dataSource.map((elm) => {
            return (
                <tr key={elm.id}>
                <td>{elm.name}</td>
                 <td>{elm.shopname}</td>
                 <td>{elm.status}</td>
                <td style={{textAlign: "center"}}>
                    <button title="Edit Shop" onClick={() => this.editHandler(elm)} className="editButton"><ion-icon name="create-outline"></ion-icon></button>
                    <button title="Delete Shop" onClick={() => this.deleteHandler(elm)} className="deleteButton"><ion-icon name="trash-outline"></ion-icon></button>
                </td>
            </tr>
            )
        })

        let overlay =  (this.state.loading ? <Overlay/> : <div/>)
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <Nav/>
                    </Col>
                </Row>
                <Container>
                    <Row>
                        <div className="body">
                            <div className="d-flex f-row">
                                <div className="d-flex flex-50 title">Welcome To Shop Management System</div>
                            </div>
                        </div>
                    </Row>

                    <Row>
                         <div className="mainAction">
                             <Button onClick={() => this.showCreateForm(true)} variant="primary">Add Shop</Button>
                        </div>
                        <div className={"tableWrapper"}> 
                            <Table striped bordered hover>
                                <thead>
                                    <tr style={{textAlign: "center"}}>
                                        <th>Name</th>
                                        <th>Shop Name</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row}
                                </tbody>
                            </Table>
                        </div>
                    </Row>

                <Modal
                    show={this.state.modalShow} onHide={() => this.showCreateForm(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Shop
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={this.state.nameValue} onChange={this.nameChangeHandler} placeholder="Name" />
                        </Form.Group>
                        <Form.Group controlId="formShopName">
                            <Form.Label>Shop Name</Form.Label>
                            <Form.Control  type="text" placeholder="Enter Shop Name" value={this.state.shopName} onChange={this.shopNameChangeHandler} />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text"  placeholder="Status"  value={this.state.status} onChange={this.statusChangeHandler}/>
                        </Form.Group>
                        
                        <Button variant="primary" onClick={this.saveFormHandler}>
                        Submit
                        </Button>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={() => this.showCreateForm(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
                </Container>
                {overlay}
            </React.Fragment>  
        )
    }
}

export default Home;