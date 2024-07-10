import { environment } from "../../environments/environment";

const base_url = environment.base_url;

interface _HospitalUser {
  _id: string;
  nombre: string;
  img: string;
}

export class Hospital {
  constructor(
    public nombre: string,
    public _id?: string,
    public img?: string,
    public usuario?: _HospitalUser,
  ){
  }
}


