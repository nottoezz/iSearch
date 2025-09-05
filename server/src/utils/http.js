// helper for itunes search
import dotenv from "dotenv";
dotenv.config()

// import axious
import axios from 'axios';

// set http to aid itunes search
const base = process.env.ITUNES_BASE_URL
export const http = axios.create({
    baseURL: base,
    timeout: 10000,
});