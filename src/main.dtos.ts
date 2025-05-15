// This interface is used to define the structure of the server response
export interface ServerHTTPResponse {
  status: number;
  message: string;
  data?: any;
  error?: any;
}

// This interface is used to define the structure of the HTTP response on the client side
export interface ClientHTTPResponse {
  status: number;
  message: string;
  data?: any;
  error?: any;
}
