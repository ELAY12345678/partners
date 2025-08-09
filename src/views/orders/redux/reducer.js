import produce from 'immer';
import _ from 'lodash';
import * as actionTypes from './constants';

const initial_reports_per_day_of_week_and_hour_data = [
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 0,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 0,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 0,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 0,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 0,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 0,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 0,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 1,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 1,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 1,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 1,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 1,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 1,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 1,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 2,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 2,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 2,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 2,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 2,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 2,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 2,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 3,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 3,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 3,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 3,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 3,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 3,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 3,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 4,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 4,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 4,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 4,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 4,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 4,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 4,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 5,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 5,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 5,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 5,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 5,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 5,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 5,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 6,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 6,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 6,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 6,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 6,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 6,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 6,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 7,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 7,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 7,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 7,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 7,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 7,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 7,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 8,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 8,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 8,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 8,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 8,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 8,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 8,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 9,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 9,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 9,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 9,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 9,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 9,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 9,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 10,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 10,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 10,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 10,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 10,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 10,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 10,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 11,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 11,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 11,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 11,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 11,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 11,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 11,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 12,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 12,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 12,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 12,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 12,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 12,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 12,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 13,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 13,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 13,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 13,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 13,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 13,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 13,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 14,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 14,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 14,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 14,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 14,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 14,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 14,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 15,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 15,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 15,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 15,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 15,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 15,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 15,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 16,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 16,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 16,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 16,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 16,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 16,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 16,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 17,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 17,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 17,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 17,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 17,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 17,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 17,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 18,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 18,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 18,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 18,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 18,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 18,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 18,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 19,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 19,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 19,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 19,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 19,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 19,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 19,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 20,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 20,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 20,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 20,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 20,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 20,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 20,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 21,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 21,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 21,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 21,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 21,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 21,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 21,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 22,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 22,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 22,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 22,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 22,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 22,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 22,
        "day_of_week": "Sábado"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 23,
        "day_of_week": "Domingo"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 23,
        "day_of_week": "Lunes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 23,
        "day_of_week": "Martes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 23,
        "day_of_week": "Miércoles"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 23,
        "day_of_week": "Jueves"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 23,
        "day_of_week": "Viernes"
    },
    {
        "reservation_quantity": 0,
        "reservation_quantity_persons": 0,
        "hour": 23,
        "day_of_week": "Sábado"
    }
];

const initialState = {
    establishmentFilters: {},
    currentReservationDetails: {},
    reservationsDatas: {},
    appartapayDatas: [],
    refresh: true,
    refreshAppartapay: true,
    userFilter: undefined,
    panelSize: {
        top: 300,
        middle: 300,
        bottom: 300,
    },
    reports_per_day_of_week_and_hour_data: [...initial_reports_per_day_of_week_and_hour_data]
};

const dashboardReducer = (state = initialState, action) =>

    produce(state, draft => {
        switch (action.type) {
            case actionTypes.SET_APPARTA_PAY_DATAS:
                draft.appartapayDatas = action.payload;
                break;

            case actionTypes.CHANGE_APPARTA_PAY_REFRESH:
                draft.refreshAppartapay = action.payload;
                break;

            case actionTypes.SET_ESTABLISHMENT_FILTERS:
                draft.establishmentFilters = action.payload;
                draft.currentReservationDetails = {};
                draft.refresh = true;
                draft.refreshAppartapay = true;
                break;

            case actionTypes.SET_CURRENT_RESERVATION_DETAILS:
                if (action.payload.id === state.currentReservationDetails.id) {
                    draft.currentReservationDetails = {};
                } else {
                    draft.currentReservationDetails = {};
                    draft.currentReservationDetails = action.payload;
                }
                break;

            case actionTypes.UPDATE_CURRENT_RESERVATION_DETAILS:
                draft.currentReservationDetails = action.payload;
                draft.refresh = true;
                break;

            case actionTypes.SET_RESERVATIONS_DATAS:
                if (action.payload && action.payload.key)
                    draft.reservationsDatas[action.payload.key] = action.payload.data;
                break;

            case actionTypes.CHANGE_REFRESH:
                draft.refresh = action.payload;
                break;

            case actionTypes.CHANGE_USER_FILTER:
                if (action.payload === "") {
                    draft.userFilter = undefined;
                    draft.refresh = true;
                    draft.refreshAppartapay = true;
                }
                else
                    draft.userFilter = action.payload;
                break;

            case actionTypes.CHANGE_PANEL_SIZE:
                if (action.payload.key === 'top') {
                    draft.panelSize.top = Number.MAX_VALUE;
                    draft.panelSize.middle = 0;
                    draft.panelSize.bottom = 0;
                } else if (action.payload.key === 'middle') {
                    draft.panelSize.top = 0;
                    draft.panelSize.middle = Number.MAX_VALUE;
                    draft.panelSize.bottom = 0;
                } else if (action.payload.key === 'bottom') {
                    draft.panelSize.top = Number.MAX_VALUE;
                    draft.panelSize.middle = 0;
                    draft.panelSize.bottom = Number.MAX_VALUE;
                }
                break;

            case actionTypes.CHANGE_REPORT_PER_DAYS_OF_WEEK:
                _.forEach(draft.reports_per_day_of_week_and_hour_data, (item) => {
                    item.reservation_quantity = 0;
                    item.reservation_quantity_persons = 0;
                })

                if (!_.isEmpty(action.payload)) {
                    _.forEach(action.payload, ({ hour, day_of_week, reservation_quantity, reservation_quantity_persons }) => {
                        const index = _.findIndex(draft.reports_per_day_of_week_and_hour_data, { hour, day_of_week });
                        if (index !== -1)
                            draft.reports_per_day_of_week_and_hour_data[index].reservation_quantity += reservation_quantity;
                        draft.reports_per_day_of_week_and_hour_data[index].reservation_quantity_persons += reservation_quantity_persons;
                    })
                }
                break;

            default:
                break;
        }
    })

export default dashboardReducer;