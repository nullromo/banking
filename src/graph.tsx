import React from 'react';

type Point = { x: number; y: number };
type Line = Point[];

const Color = Object.freeze({
    white: '#FFFFFF',
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    yellow: '#FFFF00',
    magenta: '#FF00FF',
    cyan: '#00FFFF',
    black: '#000000',
    beige: '#F5E5C9',
    cornflower: '#80B3FF',
    gray: '#808080',
});

interface GraphProps {
    canvasHeight: number;
    canvasWidth: number;
    lines: Line[];
}

interface GraphState {}

export class Graph extends React.Component<GraphProps, GraphState> {
    public constructor(props: GraphProps) {
        super(props);
        this.state = {};
        const xs = props.lines.reduce((xs, line) => {
            return [
                ...xs,
                ...line.map((point) => {
                    return point.x;
                }),
            ];
        }, [] as number[]);
        this.minX = Math.min(...xs);
        this.maxX = Math.max(...xs);
        const ys = props.lines.reduce((ys, line) => {
            return [
                ...ys,
                ...line.map((point) => {
                    return point.y;
                }),
            ];
        }, [] as number[]);
        this.minY = Math.min(...ys);
        this.maxY = Math.max(...ys);
    }

    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;

    public componentDidMount = () => {
        this.animationID = requestAnimationFrame(this.draw);
        if (!this.canvas.current) {
            throw new Error(
                'Failed to initialize canvas before graph mounted.',
            );
        }
        this.g = this.canvas.current.getContext('2d');
    };

    public componentWillUnmount = () => {
        cancelAnimationFrame(this.animationID);
    };

    private readonly canvas = React.createRef<HTMLCanvasElement>();

    private animationID = 0;

    private g: CanvasRenderingContext2D | null = null;

    private readonly draw = () => {
        if (!this.canvas.current) {
            return;
        }
        const g = this.g;
        if (!g) {
            return;
        }

        const axisPadding = 30;
        const fontSize = axisPadding / 2;

        // draw background
        g.fillStyle = Color.gray;
        g.fillRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);

        // draw axes
        g.strokeStyle = Color.black;
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(
            this.props.canvasWidth - axisPadding,
            this.props.canvasHeight - axisPadding,
        );
        g.lineTo(axisPadding, this.props.canvasHeight - axisPadding);
        g.lineTo(axisPadding, axisPadding);
        g.stroke();

        // draw axis labels
        g.font = `${fontSize}px consolas`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';

        g.fillStyle = Color.black;
        g.fillText(
            `${this.minX}`,
            axisPadding,
            this.props.canvasHeight - axisPadding / 2,
        );
        g.fillText(
            `${this.maxX}`,
            this.props.canvasWidth - axisPadding,
            this.props.canvasHeight - axisPadding / 2,
        );
        g.fillText(
            `${this.minY}`,
            axisPadding / 2,
            this.props.canvasHeight - axisPadding,
        );
        g.fillText(`${this.maxY}`, axisPadding / 2, axisPadding);

        // draw data
        this.props.lines.forEach((line) => {
            line = line.sort((a, b) => {
                return a.x - b.x;
            });
            if (line.length === 0) {
                return;
            }
            g.save();
            g.translate(axisPadding, this.props.canvasHeight - axisPadding);
            g.scale(
                (this.props.canvasWidth - 2 * axisPadding) /
                    (this.maxX - this.minX),
                -(
                    (this.props.canvasHeight - 2 * axisPadding) /
                    (this.maxY - this.minY)
                ),
            );
            g.beginPath();
            g.moveTo(line[0].x - this.minX, line[0].y - this.minY);
            line.slice(1).forEach((point) => {
                g.lineTo(point.x - this.minX, point.y - this.minY);
            });
            g.restore();
            g.stroke();
        });
        g.restore();

        this.animationID = requestAnimationFrame(this.draw);
    };

    public readonly render = () => {
        return (
            <>
                <canvas
                    ref={this.canvas}
                    className='gameCanvas'
                    height={this.props.canvasHeight}
                    width={this.props.canvasWidth}
                    //onClick={this.canvasClicked}
                    //onContextMenu={this.canvasRightClicked}
                    //onMouseLeave={this.canvasMouseLeft}
                    //onMouseMove={this.canvasMouseMoved}
                >
                    Javascript must be enabled to view the graph.
                </canvas>
            </>
        );
    };
}
