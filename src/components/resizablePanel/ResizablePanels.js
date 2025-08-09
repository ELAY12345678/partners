
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col, Button, Typography } from 'antd';
import {
    ReflexElement
} from 'react-reflex'
import 'react-reflex/styles.css'

class ControlledElement extends React.Component {

    constructor() {

        super()

        this.onMinimizeClicked =
            this.onMinimizeClicked.bind(this)

        this.onMaximizeClicked =
            this.onMaximizeClicked.bind(this)

        this.state = {
            size: -1,
        }
    }

    onMinimizeClicked() {

        const currentSize = this.getSize()

        const update = (size) => {

            return new Promise((resolve) => {

                this.setState({
                    size: size < 50 ? 50 : size
                }, () => resolve())
            })
        }

        const done = (from, to) => {

            return from < to
        }

        this.animate(
            currentSize, 50, -50,
            done, update)

        this.setState({
            ...this.state,
        })
    }

    onMaximizeClicked() {

        const currentSize = this.getSize()

        const update = (size) => {

            return new Promise((resolve) => {

                this.setState({
                    size
                }, () => resolve())
            })
        }

        const done = (from, to) => {

            return from > to
        }

        this.animate(
            currentSize, 300, 50,
            done, update)


    }

    getSize() {

        const domElement = ReactDOM.findDOMNode(this)

        switch (this.props.orientation) {

            case 'horizontal':
                return domElement.offsetHeight

            case 'vertical':
                return domElement.offsetWidth

            default:
                return 0
        }
    }

    animate(start, end, step, done, fn) {

        const stepFn = () => {

            if (!done(start, end)) {

                fn(start += step).then(() => {
                    requestAnimationFrame(stepFn)
                })
            }
        }

        stepFn()
    }



    render() {

        return (
            <ReflexElement size={this.state.size} {...this.props}>
                <Row
                    style={{
                        position: 'fixed',
                        zIndex: 1,
                        width: '100%'
                    }}>
                    <Col xs={24} sm={24} md={12} lg={9} xl={7}>
                        <Row
                            type='flex'
                            align='middle'
                            justify="space-between"
                            style={{
                                height: 50,
                                width: '100%',
                                fontSize: '1.2em',
                                background: " #fafafa",
                                borderBottom: "1px solid #d9d9d9",
                                borderRight: "1px solid #d9d9d9",
                                borderTop: "1px solid #d9d9d9",
                                padding: "0px 10px",
                            }}
                        >
                            <Col flex='auto' style={{ overflow: 'hidden' }} >
                                <Row
                                    align="middle"
                                >
                                    <Typography.Title
                                        level={5}
                                        style={{ margin: 0 }}
                                    >
                                        {this.props.title}
                                    </Typography.Title>
                                </Row>
                            </Col>
                            <Col flex='none'>
                                < Row
                                    type='flex'
                                    align='middle'
                                    gutter={16}
                                >
                                    <Col>
                                        {this.props.counter}
                                    </Col>
                                    <Col>
                                        <Button
                                            type="text"
                                            shape="circle"
                                            onClick={this.onMinimizeClicked}
                                        >
                                            <Typography.Title level={5}>
                                                -
                                            </Typography.Title>
                                        </Button>
                                        <Button
                                            type="text"
                                            shape="circle"
                                            onClick={this.onMaximizeClicked}
                                        >
                                            <Typography.Title level={5}>
                                                +
                                            </Typography.Title>
                                        </Button>
                                    </Col>
                                </Row >
                            </Col>
                        </Row >
                    </Col>
                </Row>
                <div
                    style={{
                        paddingTop: 50,
                    }}>
                    {this.props.children}
                </div>
            </ReflexElement>
        )
    }
}


export default ControlledElement;