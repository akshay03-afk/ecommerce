import React from 'react';
import { Card } from 'antd';
import laptop from "../images/laptop.png"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from  "react-router-dom";
const { Meta } = Card;

const AdminProductCard = ({product, handleRemove}) => {
    const {title, description, images, slug} = product;

    return (
        <Card className="mb-5 mt-2"
        hoverable
        style={{ width: 320 }}
        cover={<img alt="images" src={images && images.length ? images[0].url : laptop} className="p-1 responsive"
          style={{height: "230px"}}
        />}
        actions={
          [
            <Link to={`/admin/product/${slug}`}>
              <EditOutlined className="text-primary" /> 
            </Link>, 
            <DeleteOutlined className="text-danger" onClick={() => handleRemove(slug)} />,
          ]
        }
        >
        <Meta title={title} description={`${description && description.substring(0,30)}...`} />
      </Card>
    
    )
}

export default AdminProductCard;
