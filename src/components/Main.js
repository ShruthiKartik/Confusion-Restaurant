import React , { useEffect } from 'react';
import { Routes, Route ,Navigate, useParams, useLocation } from 'react-router-dom';
import { useSelector , useDispatch } from 'react-redux';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import Contact from './Contact';
import About from './About';
import Dishdetail from './Dishdetail';
import * as actionCreators from '../redux/ActionCreators';


const Main =(props)=> {

    const [dishes,comments,promotions,leaders] = useSelector((state) => [
      
        state.dishes,
        state.comments,
        state.promotions,
        state.leaders
     
    ]);
  
    const dispatch = useDispatch();
    
    useEffect(() => {
      dispatch(actionCreators.fetchDishes());
      dispatch(actionCreators.fetchComments());
      dispatch(actionCreators.fetchPromos());
      dispatch(actionCreators.fetchLeaders());
    },[]);
    
  
    const HomePage = () => {
        return(
          <Home dish={dishes.dishes.filter((dish) => dish.featured)[0]}
          dishesLoading={dishes.isLoading}
          dishesErrMess={dishes.errMess}
          promotion={promotions.promotions.filter((promo) => promo.featured)[0]}
          promoLoading={promotions.isLoading}
          promoErrMess={promotions.errMess}
          leader={leaders.leaders.filter((leader) => leader.featured)[0]} 
          leadersLoading={leaders.isLoading}
          leadersErrMess={leaders.errMess}/>
        );
      }

      const DishWithId = () => {
        let params=useParams();
        return(
            <Dishdetail dish={dishes.dishes.filter((dish) => dish.id === parseInt(params.dishId,10))[0]} 
            isLoading={dishes.isLoading}
            errMess={dishes.errMess}
            comments={comments.comments.filter((comment) => comment.dishId === parseInt(params.dishId,10))} 
            commentsErrMess={comments.errMess}
            postComment={(dishId, rating, author, comment)=>{dispatch(actionCreators.postComment(dishId, rating, author, comment))}} />
        );
      };
      
      const location=useLocation();
      
  
    return (
      
      <div>
        <Header/>
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={300}>
                <Routes>
                    <Route path='/home' element={<HomePage/>}/>
                    <Route path='/menu' element={ <Menu dishes={dishes} />} />
                    <Route path='/contactus' element={<Contact resetFeedbackForm={()=>{dispatch(actions.reset('feedback'))}} postFeedback={(firstname,lastname,telnum,email,agree,contactType,message)=>{dispatch(actionCreators.postFeedback(firstname,lastname,telnum,email,agree,contactType,message))}}/>}/>
                    <Route path='/aboutus' element={<About leaders={leaders.leaders} leadersLoading={leaders.isLoading}  leadersErrMess={leaders.errMess}/>}/>
                    <Route path='//menu/:dishId' element={<DishWithId/>}/>
                    <Route path="*" element={<Navigate to="/home" />}/>
                </Routes>
              </CSSTransition>
        </TransitionGroup>
        <Footer/>
      </div>
    );
  }


export default Main;