import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Col, Row
} from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './Loading';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        // this.props.postComment(3, 4, 'Shruthi', 'q');

        // console.log(this.props.dishId, values.rating, values.author, values.comment);
        this.toggleModal();
    }

    render() {
        return (
            <>
                <Button outline onClick={this.toggleModal}><i className="fa fa-pencil"></i> Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Label htmlFor="rating" className="my-2" >Rating</Label>
                                    <Control.select model=".rating" name="rating"
                                        className="form-control" id="rating" validators={{
                                            required
                                        }} >
                                        <option selected>1</option>
                                        <option >2</option>
                                        <option >3</option>
                                        <option >4</option>
                                        <option >5</option>
                                    </Control.select>
                                    <Errors
                                        className="text-danger"
                                        model=".rating"
                                        show="touched"
                                        messages={{
                                            required: 'Required '
                                        }}
                                    />
                            <Label htmlFor="author" className="my-2">Your Name</Label>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                            <Label htmlFor="comment" className="my-2" >Comment</Label>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"
                                        className="form-control" validators={{
                                            required
                                        }}/>
                                    <Errors
                                        className="text-danger"
                                        model=".comment"
                                        show="touched"
                                        messages={{
                                            required: 'Required '
                                        }}
                                    />   
                            <Button type="submit" color="primary" className="my-2">
                                        Submit
                            </Button> 
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}


function RenderComments({ comments, postComment, dishId }) {
    console.log(comments)
    if (comments == null)
        return (
            <div></div>
        );
    const cmnt = comments.map(element => {
        return (
            <Fade in>
                <li key={element.id}>
                    <p>{element.comment}</p>
                    <p>-- {element.author},
                        &nbsp;
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(element.date)))}
                    </p>
                </li>
            </Fade>
        );
    })
    return (
        <div className='col-12 col-md-5 m-1'>
            <h4> Comments </h4>
            <ul className='list-unstyled'>
                <Stagger in>
                    {cmnt}
                </Stagger>
            </ul>
            <CommentForm dishId={dishId} postComment={postComment}/>
        </div>
    );


}

function RenderDish({ dish }) {
    // console.log(dish)
    if (dish != null)
        return (
            <FadeTransform
            in
            transformProps={{
                exitTransform: 'scale(0.5) translateY(-50%)'
            }}>
                <Card>
                    <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle tag="h5">{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>

        );
    else
        return (
            <div></div>
        );
}



const Dishdetail = (props) => {
    const dish = props.dish;
    // console.log(selectedDish.comments)
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    
    else if (dish != null){
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <RenderComments comments={props.comments}  postComment={props.postComment}
            dishId={props.dish.id}/>

                </div>
            </div>
        );
    }
    else
        return (<div></div>);
}


export default Dishdetail;







