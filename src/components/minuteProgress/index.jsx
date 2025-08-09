import { message, Progress, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getService } from '../../services';

const MinuteProgress = ({
    myInterval,
    fullWidth,
    record,
    onFinish,
    ...props
}) => {

    const interval = 1000;
    const { createdAt, current_server_hour } = record;
    const eventTime = moment(createdAt).toDate().getTime();
    const currentTime = moment(current_server_hour).toDate().getTime();

    let duration = moment.duration(
        moment(currentTime) - moment(eventTime),
        "milliseconds"
    );

    const [totalTime, setTotalTime] = useState(0);
    const [leftTime, setLeftTime] = useState();
    const [successPercent, setSuccessPercent] = useState();

    const [minsToAutoApproveReservation, setMinsToAutoApproveReservation] = useState();

    const startTimer = (value) => {
        let total = 1000 * 60 * value;
        let time = duration.asMilliseconds();

        setTotalTime(total);
        if (time >= 0 && time <= total) {
            duration = moment.duration(moment(total) - time, "milliseconds");
            time = duration.asMilliseconds();
            let percent = (time / total) * 100;

            setSuccessPercent(percent);
            myInterval = setInterval(function () {
                if (duration.asSeconds() <= 0) {
                    if (onFinish)
                        onFinish();
                    setSuccessPercent(0);
                    clearInterval(myInterval);
                }
                duration = duration.subtract(1, "seconds");
                time = duration.asMilliseconds();
                percent = (time / total) * 100;
                setSuccessPercent(percent);
                setLeftTime(duration);
            }, interval);
        } else {
            if (onFinish)
                onFinish();
            setSuccessPercent(0);
        }
    };

    const getConfiguration = (id = 9) => {
        const service = getService("configurations");
        service
            .get(id)
            .then(({ value }) => {
                startTimer(value);
                setMinsToAutoApproveReservation(Number(value));
            })
            .catch((err) => message.error(err.message));
    };

    useEffect(() => {
        getConfiguration();
    }, []);

    useEffect(() => {
        return () => {
            if (myInterval) {
                clearInterval(myInterval);
            }
        };
    }, []);

    useEffect(() => {
        if (successPercent <= 0) {
        }
    }, [successPercent]);

    return (
        <>
            {successPercent > 0 && (
                <Tooltip
                    title={
                        leftTime &&
                        `
                  Restan ${leftTime && leftTime.minutes() > 0
                            ? leftTime.minutes() + " min"
                            : ""
                        } 
                       ${leftTime && leftTime.seconds() + "s"}
                  de ${totalTime && moment.duration(totalTime).humanize()}
              `
                    }
                    placement="leftTop"
                >
                    <Progress
                        size="small"
                        type="circle"
                        strokeWidth={10}
                        percent={successPercent}
                        showInfo
                        strokeColor={{
                            "0%": "#F98F66",
                            "100%": "#F98F66",
                        }}
                        format={(percent, success) => (
                            <span>
                                {leftTime && (
                                    <>
                                        {leftTime.minutes() > 0 && (
                                            <span>
                                                {leftTime.minutes()}
                                                <br />
                                                Min
                                            </span>
                                        )}
                                        {leftTime.minutes() === 0 && leftTime.seconds() > 0 && (
                                            <span>
                                                {leftTime.seconds()}
                                                <br />
                                                Seg
                                            </span>
                                        )}
                                    </>
                                )}
                            </span>
                        )}
                        status={successPercent > 0 ? "active" : "exception"}
                        style={{ stroke: 'transparent' }}
                        {...props}
                    />
                </Tooltip>
            )}
        </>
    );
};

export default MinuteProgress;