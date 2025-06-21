export interface IDocumentRequest {
  base64String: string;
  fileName: string;
  folderId: string;
  name: string;
  isPrivate: boolean;
  statusDocument: string;
  userId: number;
}

export interface IDocumentResponse {
  id: number;
  name: string;
  totalDownloads: number;
  totalViews: number;
  fileId: string;
  isPrivate: boolean;
  statusDocument: string;
  userId: number;
  folderId: string;
  createdDate: date;
  modifiedDate: date;
}