import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_BASE_URL!

export const getSymbolInfo = async () => {
    const res = await axios.get(`${BASE_URL}/api/symbols`)
    return res.data
}

export const getBook = async (symbol: string, exchanges?: string[]) => {
    let url = `${BASE_URL}/api/book/${symbol}`
    if(exchanges) {
        url += `?exchanges=${exchanges}`
    }
    const res = await axios.get(url)
    return res.data
}

