import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Wrapper } from "./Styles";
import { Button, message } from "antd";
import { getService } from "../../../services";
import toDataURL from 'svg-to-dataurl';
const QRGenerator = ({ value, record, ...props }) => {
    const getQR = async () => {
        return new Promise((resolve, reject) => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", localStorage.getItem("feathers-jwt"));
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "restaurant_slug": record.slug
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://api.poketmenu.app/generate-qrcode-download", requestOptions)
                .then(response => response.text())
                .then(result => {
                    resolve(toDataURL(result));
                })
                .catch(error => {
                    console.log('error', error)
                    reject(error);
                });
        });
    }
    const download = async () => {
        let imgURL = await getQR();
        console.log("ESTE ES EL SVG: ", imgURL)
        const a = document.createElement("a");
        a.target = "_blank";
        a.href = imgURL;
        a.download = record.slug + ".svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    /* const _download = (url) => {
         const service = getService("generate-qrcode-download");
         service.create({
             restaurant_slug: record.slug
         })
             .then(resp => {
                 console.log(resp);
             })
             .catch(err => {
                 message.error(err.message);
             });

        const a = document.createElement('a')
        a.href = url
        a.download = url.split('/').pop()
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    } */
    return (<Wrapper>
        <div className="qr-content">
            {/* <QRCode value={value} {...props} /> */}
            <img src={value}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
        <div className="qr-footer">
            <Button
                block
                onClick={() => download(value)}
                block type="primary" icon="download" >DESCARGAR SVG</Button>
        </div>
    </Wrapper>)
}
export default QRGenerator;