import PathFolder from './PathFolder';
import getSlug from '@/utils/getSlug';
import { IDriveItem, IDriveResponse } from '@/types/driver.d.ts';


interface GridDocumentProps {
    content: IDriveItem[]
    data: IDriveResponse
    slug: string[]
    path: string[]
}

export default function GridDocument({ content, data, slug, path }: GridDocumentProps) {
    const router = useRouter();
    const url = useMemo(() => slug.join('/'), [slug]);

    return (
        <div className="container mx-auto px-4">
            <PathFolder path={path} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {content.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => router.push(`/document/${url}/${item.name}`)}
                    >
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}