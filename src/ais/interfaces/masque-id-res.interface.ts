export interface MasqueIdData {
  individualId: string;
  accountAddress: string;
  status: string;
  description: string;
  masqueId: string;
  name: string;
  requestId: string;
  thumbnail: string;
  displayPic: string;
  gltf: string;
  link: string;
}

export interface MasqueIdResponse {
  resultCode: string;
  resultDescription: string;
  data: MasqueIdData;
}
