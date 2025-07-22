export interface IStar {
  userId: number
  documentId: number
}

export interface IRanking {
  fullname: string
  totalUpload: number
}

export interface IParameterDocument {
  totalDocumentShare: number
  totalUserContribute: number
  totalCourseShare: number
}

export interface ILineChartDate {
  date: string
  file: number
}

export interface IStatisticalAdmin {
  totalDocuments: number;
  totalUsers: number;
  totalCourses: number;
  totalDocumentToday: number;
  percentDocuments: number;
  percentUsers: number;
  percentCourses: number;
  percentDocumentToday: number;
}