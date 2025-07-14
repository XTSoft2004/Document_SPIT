import { FileSpreadsheet, TrendingDownIcon, TrendingUpIcon, Users, BookOpen, Calendar } from "lucide-react"

import { Badge } from "@/components/ui/shadcn-ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn-ui/card"

type SectionCardInfo = {
  name: string;
  icon: React.ReactNode;
  value: string | number;
  title: string;
  percent: number;
}

export function SectionCards() {
  const sectionCards: SectionCardInfo[] = [
    {
      name: "Tổng tài liệu",
      icon: (
        <div className="p-2 bg-blue-500 rounded-lg shadow-lg">
          <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      ),
      value: "15",
      title: "tài liệu",
      percent: 12.5,
    },
    {
      name: "Người dùng",
      icon: (
        <div className="p-2 bg-green-500 rounded-lg shadow-lg">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      ),
      value: "120",
      title: "người dùng",
      percent: 8.3,
    },
    {
      name: "Môn học",
      icon: (
        <div className="p-2 bg-yellow-500 rounded-lg shadow-lg">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      ),
      value: "50",
      title: "môn học",
      percent: 5.0,
    },
    {
      name: "Hôm nay",
      icon: (
        <div className="p-2 bg-purple-500 rounded-lg shadow-lg">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      ),
      value: "30",
      title: "tài liệu",
      percent: 15.0,
    }
  ]
  const renderCard = (card: SectionCardInfo) => (
    <Card key={card.name} className="relative overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 shadow-lg to-white">
      <CardHeader className="pb-3 sm:pb-4 space-y-3">
        <CardDescription className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <span className="font-medium">{card.name}</span>
          <Badge
            variant="outline"
            className="flex items-center gap-1 rounded-full text-[10px] sm:text-xs px-2 py-1 bg-green-100 text-green-700 border-green-300 hover:bg-green-200 transition-colors"
          >
            {card.percent > 0 ? <TrendingUpIcon className="w-3 h-3" /> : <TrendingDownIcon className="w-3 h-3" />}
            <span>{card.percent}%</span>
          </Badge>
        </CardDescription>
        <CardTitle className="flex items-center gap-3 text-sm sm:text-lg lg:text-xl font-semibold text-gray-800">
          {card.icon}
          <span className="text-center max-w-[70] truncate">{card.value} {card.title}</span>
        </CardTitle>
      </CardHeader>
    </Card>
  )
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Responsive grid with improved breakpoints for all screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 !pb-0">
        {/* Total Documents Card */}
        {sectionCards.map(renderCard)}
      </div>
    </div>
  )
}
