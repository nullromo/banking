import React, { MouseEvent } from 'react';

export type Point = { x: number; y: number };
type Line = Point[];

const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const msToDate = (ms: number) => {
    const date = new Date(ms);
    return date.toLocaleDateString();
};

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
        console.log(xs);
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

    private mousePosition: Point = { x: 0, y: 0 };
    private crosshairPosition: Point = { x: 0, y: 0 };

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

    private readonly axisPadding = 30;

    private readonly draw = () => {
        if (!this.canvas.current) {
            return;
        }
        const g = this.g;
        if (!g) {
            return;
        }

        const fontSize = this.axisPadding / 2;

        // draw background
        g.fillStyle = Color.gray;
        g.fillRect(0, 0, this.props.canvasWidth, this.props.canvasHeight);

        // draw axes
        g.strokeStyle = Color.black;
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(
            this.props.canvasWidth - this.axisPadding,
            this.props.canvasHeight - this.axisPadding,
        );
        g.lineTo(this.axisPadding, this.props.canvasHeight - this.axisPadding);
        g.lineTo(this.axisPadding, this.axisPadding);
        g.stroke();

        // draw axis labels
        g.font = `${fontSize}px consolas`;
        g.textAlign = 'left';
        g.textBaseline = 'middle';
        g.fillStyle = Color.black;
        g.fillText(
            `${msToDate(this.minX)}`,
            this.axisPadding,
            this.props.canvasHeight - this.axisPadding / 2,
        );
        g.textAlign = 'right';
        g.fillText(
            `${msToDate(this.maxX)}`,
            this.props.canvasWidth - this.axisPadding,
            this.props.canvasHeight - this.axisPadding / 2,
        );
        g.textAlign = 'left';
        g.fillText(
            `${moneyFormatter.format(this.minY)}`,
            this.axisPadding / 2,
            this.props.canvasHeight - this.axisPadding,
        );
        g.fillText(
            `${moneyFormatter.format(this.maxY)}`,
            this.axisPadding / 2,
            this.axisPadding,
        );

        // draw data
        this.props.lines.forEach((line) => {
            line = line.sort((a, b) => {
                return a.x - b.x;
            });
            if (line.length === 0) {
                return;
            }
            g.save();
            g.translate(
                this.axisPadding,
                this.props.canvasHeight - this.axisPadding,
            );
            g.scale(
                (this.props.canvasWidth - 2 * this.axisPadding) /
                    (this.maxX - this.minX),
                -(
                    (this.props.canvasHeight - 2 * this.axisPadding) /
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

        // draw crosshair
        g.beginPath();
        g.moveTo(this.mousePosition.x, 0);
        g.lineTo(this.mousePosition.x, this.props.canvasHeight);
        g.stroke();
        g.beginPath();
        g.moveTo(0, this.mousePosition.y);
        g.lineTo(this.props.canvasWidth, this.mousePosition.y);
        g.stroke();
        g.textAlign = 'right';
        g.fillText(
            `Mouse: (${msToDate(
                this.crosshairPosition.x,
            )}, ${moneyFormatter.format(this.crosshairPosition.y)})`,
            this.props.canvasWidth,
            20,
        );

        // draw cursor
        const cursorSize = 4;
        g.fillStyle = Color.blue;
        const cursorValue =
            (() => {
                const line = this.props.lines[0];
                return line.find((point, index) => {
                    const nextPoint =
                        line[Math.min(index + 1, line.length - 1)];
                    return (
                        point.x <= this.crosshairPosition.x &&
                        nextPoint.x >= this.crosshairPosition.x
                    );
                });
            })()?.y ?? 0;
        g.fillRect(
            this.mousePosition.x - cursorSize,
            this.props.canvasHeight -
                this.axisPadding -
                ((cursorValue - this.minY) / (this.maxY - this.minY)) *
                    (this.props.canvasHeight - 2 * this.axisPadding) -
                cursorSize,
            2 * cursorSize,
            2 * cursorSize,
        );
        g.fillText(
            moneyFormatter.format(cursorValue),
            this.props.canvasWidth,
            40,
        );

        this.animationID = requestAnimationFrame(this.draw);
    };

    private readonly getMouseCoordinates = (event: MouseEvent) => {
        if (!this.canvas.current) {
            return { x: 0, y: 0 };
        }
        const canvasBounds = this.canvas.current.getBoundingClientRect();
        const clickX = Math.floor(event.clientX - canvasBounds.left);
        const clickY = Math.floor(event.clientY - canvasBounds.top);
        return { x: clickX, y: clickY };
    };

    private readonly canvasMouseMoved = (event: MouseEvent) => {
        const mouseCoordinates = this.getMouseCoordinates(event);
        this.mousePosition = mouseCoordinates;
        this.crosshairPosition = {
            x:
                ((this.mousePosition.x - this.axisPadding) *
                    (this.maxX - this.minX)) /
                    (this.props.canvasWidth - 2 * this.axisPadding) +
                this.minX,
            y:
                ((this.props.canvasHeight -
                    this.mousePosition.y -
                    this.axisPadding) *
                    (this.maxY - this.minY)) /
                    (this.props.canvasHeight - 2 * this.axisPadding) +
                this.minY,
        };
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
                    onMouseMove={this.canvasMouseMoved}
                >
                    Javascript must be enabled to view the graph.
                </canvas>
            </>
        );
    };
}
