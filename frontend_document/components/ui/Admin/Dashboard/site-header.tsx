import { Separator } from '@/components/ui/shadcn-ui/separator'
import { SidebarTrigger } from '@/components/ui/shadcn-ui/sidebar'
import { Image } from "antd";
import RealTimeDateTime from '../../Header/RealTimeDateTime';

export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-20 bg-white shadow-sm w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex items-center justify-center flex-1 ml-[-13%] lg:hidden">
            <Image
              src="/logo/logo-500x500.png"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full object-contain"
              style={{ objectFit: "contain" }}
              preview={false}
            />
            <span className="text-xl ml-2 text-center font-extrabold tracking-wide drop-shadow-sm">
              SPIT Document
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* Notification Icon */}
            <button
              type="button"
              className="relative p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            {/* Dark Mode Toggle */}
            <button
              type="button"
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Toggle dark mode"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
            {/* Real-time Date Time */}
            <RealTimeDateTime />
          </div>
        </div >
      </header >
    </>

  )
}
