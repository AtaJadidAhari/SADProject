import React, {Component} from "react";
import axios from "axios";
import Template from "../components/template";
import {Grid, Loader, Dimmer, Segment, Button} from "semantic-ui-react";
import BookCard from "../components/bookCard";
import AskedQuestions from "../components/askedQuestions";
import PurchasedBooks from "../components/purchasedBooks";
import SidebarMenu from '../components/sidebarMenu'

import PublicInfo from '../components/publicInfo'


const menuItems = [
    {
        'name': 'مشخصات کاربری',
        'iconName': 'user',
    },


    {
        'name': 'سوالات پرسیده شده',
        'iconName': 'question circle',
    },
    {
        'name': 'سوالات جواب داده',
        'iconName': 'check circle',
    },


];


class PublicProfile extends Component {


    state = {
        books: [],
        bought_books: [],
        numOfChapters: [],
        activeItem: 'مشخصات کاربری',
        username: '',
        userInfo: {},
        allow: false,
        askedQuestions: [],
        answeredQuestions: [],
        level: false,


    };


    handleItemClick = (e, {name}) => this.setState({activeItem: name});
    getPageContent = () => {
        if (this.state.activeItem === 'مشخصات کاربری') {
            console.log('personal info', this.state.userInfo)
            return (
                <PublicInfo info={this.state.userInfo}/>
            )
        } else if (this.state.activeItem === 'سوالات پرسیده شده') {
            if (this.state.askedQuestions.length === 0) {
                return (
                    <p style={{fontSize: '2em'}}>این کاربر سوالی نپرسیده است.</p>
                )
            } else {
                return (
                    <AskedQuestions isProfile={1} asker={this.state.username} question={this.state.askedQuestions}/>
                )
            }
        } else if (this.state.activeItem === 'سوالات جواب داده') {
            if (this.state.answeredQuestions.length === 0) {
                return (
                    <p style={{fontSize: '2em'}}> این کاربر جوابی نداده است.</p>
                )
            } else {
                return (
                    <AskedQuestions isProfile={0} question={this.state.answeredQuestions}/>
                )
            }
        }


    };

    componentDidMount() {
        document.title = "پروفایل";


        axios.get('http://localhost:8000/auth/profile/' + this.props.urlParameters.username, )


            .then(res => {

                this.setState(
                    {
                        userInfo: res.data.user_info,
                        askedQuestions: res.data.asked_questions,
                        username: this.props.urlParameters.username,

                        answeredQuestions: res.data.user_info.answered_questions,
                    }
                );


                var that = this;
            }).catch((error) => {
            console.log(error)
        })

    }


    render() {

        return (

            <Template {...this.props}>

                <Grid style={{margin: 'auto', direction: 'rtl', width: '70%', height: '100%'}}>
                    <Grid.Row columns={2} style={{padding: '0'}}>
                        <Grid.Column width={3}>
                            <SidebarMenu activeItem={this.state.activeItem} menuItems={menuItems}
                                         handleItemClick={this.handleItemClick}/>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {this.getPageContent()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Template>


        )
    }
}
export default PublicProfile;