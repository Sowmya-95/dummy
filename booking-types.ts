export type FeedbackProps = {
  isVertical: boolean
  bgColor: string
  iconName: string
  title: string
  clickable: boolean
}

export type StatisticProps = {
  statText: string
  isSmallText?: boolean
  statNumber: number
  statNumberPosition?: StatisticNumberPosition
  statNumberColor?: string
  bgColor: string
  buttonEmit?: string
}

export enum StatisticNumberPosition {
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
  "topLeftOverlapping",
  "topRightOverlapping",
  "bottomLeftOverlapping",
  "bottomRightOverlapping",
}