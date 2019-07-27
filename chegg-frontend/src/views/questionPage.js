import React, {Component} from "react";
import {Button, Divider, Grid, Menu, Segment} from 'semantic-ui-react'
import Template from '../components/template/template';
import axios from "axios";
import Ad from '../components/ad'
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {EditorState, convertToRaw, ContentState, convertFromRaw, convertFromHTML} from 'draft-js';
import QuestionPart from '../components/question/questionOfQuestionPage'
import AnswerOfQuestionPage from '../components/question/answerOfQuestionPage'




const toolbarEditor = {
    options: ['inline', 'blockType', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],

    blockType: {
        inDropdown: true,
        options: ['Normal', 'Code'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    fontSize: {

        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    fontFamily: {
        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    list: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['unordered', 'ordered', 'indent', 'outdent'],
        unordered: {className: undefined},
        ordered: {className: undefined},
        indent: {className: undefined},
        outdent: {className: undefined},
    },
    textAlign: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['left', 'center', 'right', 'justify'],
        left: {className: undefined},
        center: {className: undefined},
        right: {className: undefined},
        justify: {className: undefined},
    },
    colorPicker: {

        className: undefined,
        component: undefined,
        popupClassName: undefined,
        colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
            'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
            'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
            'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
            'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
            'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
    },
    link: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        dropdownClassName: undefined,
        showOpenOptionOnHover: true,
        defaultTargetOption: '_self',
        options: ['link', 'unlink'],
        link: {className: undefined},
        unlink: {className: undefined},
        linkCallback: undefined
    },

    embedded: {

        className: undefined,
        component: undefined,
        popupClassName: undefined,
        embedCallback: undefined,
        defaultSize: {
            height: 'auto',
            width: 'auto',
        },
    },
    image: {

        className: undefined,
        component: undefined,
        popupClassName: undefined,
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: true,
        uploadCallback: undefined,
        previewImage: false,
        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
        alt: {present: false, mandatory: false},
        defaultSize: {
            height: 'auto',
            width: 'auto',
        },
    },
    remove: {className: undefined, component: undefined},
    history: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['undo', 'redo'],
        undo: {className: undefined},
        redo: {className: undefined},
    },
}

class QuestionPage extends Component {


    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            text: '',
            question: {},
            replies: []
        };

    }

    onContentStateChange = (editorState) => {

        this.setState({
            text: editorState
        })
    };

    onEditorStateChange = (editorState) => {


        this.setState({
            editorState,
        });
    };


    componentWillMount() {


        document.title = "صفحه ی سوال";
        var urlParameters = this.props.match.params;
        var that = this;

        axios.get('http://localhost:8000/qa/questions/' + urlParameters.id + '/')
            .then(res1 => {

                axios.get('http://localhost:8000/qa/questions/' + urlParameters.id + '/replies/')
                    .then(res2 => {
                        this.setState({
                                question: res1.data,
                                replies: res2.data,
                            }
                        )

                    })
                    .catch(

                    )


            })
            .catch(

            )


    }


    render() {

        const {editorState} = this.state;
        const styleObj = {
            minHeight:'100px',
            border: '0.3px solid gray',
            padding: '0 5px',
            maxHeight: '200px',
            margin: '0',
            overFlow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'

        };


        return (

            <Template {...this.props}>
                <Grid style={{margin: 'auto', width: '70%', maxHeight: '100%', overflow: 'auto'}}>
                    <Grid.Row columns={1} style={{height: '100%',}}>

                        <Grid.Column width={13} style={{height: '100%',}}>
                            <Segment>
                                <QuestionPart question={this.state.question}/>

                                <div style={{fontWeight: 'bold', fontSize: '1.5em', direction: 'rtl', marginTop:'20px'}}>
                                    <br/>
                                    {this.state.question.num_of_replies}&nbsp;&nbsp; پاسخ
                                </div>
                                <Divider section/>
                                {this.state.replies.map(reply =>
                                    <AnswerOfQuestionPage reply={reply}/>
                                )}

                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '1.5em',
                                    direction: 'rtl',
                                    marginBottom: '25px',
                                }}>
                                    <br/>
                                    پاسخ شما
                                </div>


                                <Editor
                                    editorState={editorState}
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    editorStyle={styleObj}
                                    onEditorStateChange={this.onEditorStateChange}
                                    onContentStateChange={this.onContentStateChange}
                                />
                                <div style={{width:'100%', textAlign:'right'}}>
                                <Button type='submit'
                                                    style={{
                                                        fontFamily: 'B Yekan',
                                                        color: '#ffffff',
                                                        backgroundColor: 'cornflowerblue',
                                                        padding: '12px 60px',
                                                        marginTop:'15px',
                                                        marginLeft:'auto',
                                                    }}>ارسال پاسخ</Button>
                                </div>
                            </Segment>


                        </Grid.Column>

                        <Grid.Column width={3}>
                            <Ad ad1={"https://cdn.zoomg.ir/2019/3/4db9f81a-8796-431d-9ef0-80fbc174257c.gif"}
                                ad2={"https://cdn.zoomg.ir/2019/3/4db9f81a-8796-431d-9ef0-80fbc174257c.gif"}
                                ad3={"https://cdn.zoomg.ir/2019/3/4db9f81a-8796-431d-9ef0-80fbc174257c.gif"}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>


            </Template>


        )
    }
}

export default QuestionPage;