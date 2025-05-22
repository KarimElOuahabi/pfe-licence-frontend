import React from "react";
import { Card } from "antd";

const { Meta } = Card;

interface CardItemProps {
  title: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
  width?: number;
}

const CardItem: React.FC<CardItemProps> = ({
  title,
  description,
  imageUrl,
  onClick,
  width = 240,
}) => (
  <Card
    hoverable
    onClick={onClick}
    style={{ width }}
    cover={<img alt={title} src={imageUrl} />}
  >
    <Meta title={title} description={description} />
  </Card>
);

export default CardItem;
