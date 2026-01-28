import {
    BaseBoxShapeUtil,
    Geometry2d,
    HTMLContainer,
    RecordProps,
    Rectangle2d,
    T,
    TLBaseShape,
} from 'tldraw'

export type DigitalItemShape = TLBaseShape<
    'digital-item',
    {
        w: number
        h: number
        ipfsHash: string
        title: string
        owner: string
        timestamp: number
        idOnChain: number
        isDeleted: boolean
    }
>

export class DigitalItemShapeUtil extends BaseBoxShapeUtil<DigitalItemShape> {
    static override type = 'digital-item' as const
    static override props: RecordProps<DigitalItemShape> = {
        w: T.number,
        h: T.number,
        ipfsHash: T.string,
        title: T.string,
        owner: T.string,
        timestamp: T.number,
        idOnChain: T.number,
        isDeleted: T.boolean,
    }

    override getDefaultProps(): DigitalItemShape['props'] {
        return {
            w: 300,
            h: 200,
            ipfsHash: '',
            title: '',
            owner: '',
            timestamp: 0,
            idOnChain: -1,
            isDeleted: false,
        }
    }

    override getGeometry(shape: DigitalItemShape): Geometry2d {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        })
    }

    override component(shape: DigitalItemShape) {
        const isDeleted = shape.props.isDeleted;
        const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.pinata.cloud';
        const imageUrl = `${gateway}/ipfs/${shape.props.ipfsHash}`;

        // Formatting timestamp
        const date = new Date(shape.props.timestamp * 1000).toLocaleDateString();

        return (
            <HTMLContainer className="pointer-events-all">
                <div
                    className={`w-full h-full relative group rounded-lg overflow-hidden shadow-lg border-2 ${isDeleted ? 'border-red-500 opacity-70 grayscale' : 'border-white bg-white'}`}
                    style={{ transition: 'all 0.2s' }}
                >
                    {/* Image */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt={shape.props.title}
                            className="w-full h-full object-cover pointer-events-none"
                            draggable={false}
                        />
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-2 text-xs transition-opacity opacity-0 group-hover:opacity-100 flex flex-col gap-1">
                        <div className="font-bold truncate">{shape.props.title || 'Untitled'}</div>
                        <div className="flex justify-between items-center opacity-80">
                            <span className="font-mono">{shape.props.owner.slice(0, 6)}...{shape.props.owner.slice(-4)}</span>
                            <span>{date}</span>
                        </div>
                        {isDeleted && <div className="text-red-300 font-bold text-center mt-1">PERMANENTLY DELETED (BUT STILL HERE)</div>}
                    </div>

                    {/* Deleted Badge if not hovering but deleted */}
                    {isDeleted && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-red-600 text-white px-3 py-1 font-bold text-lg rotate-[-15deg] shadow-lg border-2 border-white">DELETED</span>
                        </div>
                    )}
                </div>
            </HTMLContainer>
        )
    }

    override indicator(shape: DigitalItemShape) {
        return <rect width={shape.props.w} height={shape.props.h} />
    }
}
