import axios from 'axios';

const Axiosinstance = axios.create({
  baseURL: 'https://dev-testnet.nordl.io',
});

export default Axiosinstance;
