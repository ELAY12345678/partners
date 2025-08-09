import React, { useState, useEffect } from 'react';
import { Card, Button, Col } from "antd";
import { Container } from "./Styles";
import { useNavigate } from "react-router-dom";

const Box = ({ children, ...props }) => {
    const [show, setShow] = useState(props.show || false);
    const [goBack, setGoBack] = useState(false);
    const navigate = useNavigate();
    
    const handleShowHidde = () => {
        if (props.xtype)
            setShow(show => (!show));
    }
    useEffect(() => {
        if (props.goBack || props.resource)
            setGoBack(props.goBack || typeof props.resource != "undefined");
    }, [props.goBack])

    return (
        <Container xtype={props.xtype} className={props.className}>
            {!props.transparent
                ? <Card
                    bordered={typeof props.xtype == "undefined"}
                    className={`card-${show ? "opened" : "closed"}`}
                    title={
                        props.title &&
                        <div
                            className="head-title"
                            onClick={handleShowHidde}
                        >
                            {
                                goBack && <Button type="link" size="large" icon="arrow-left" onClick={() => {
                                    let query = props.location.search;

                                    navigate(props.resource ? `/dashboard/${props.resource}${query ? query : ""}` : '../', { replace: true })
                                }} />
                            }
                            {
                                props.xtype && <Button
                                    style={{
                                        width: 30
                                    }}
                                    className="btn-show" icon={show ? "up" : "down"} type="link"
                                    onClick={handleShowHidde} />
                            }
                            <span>
                                {props.title}
                            </span>
                        </div>
                    }
                >
                    <>{show && children}</>
                </Card>
                : <Col span={24}>{show && children}</Col>
            }
        </Container>
    );
}
export default Box;