import React, { useState } from "react";
import "../assets/css/landing.styles.css";
import { Button, Input, Form } from "antd";
import { SearchOutlined, ArrowUpOutlined } from '@ant-design/icons';
import logo from '../assets/logo/main.png';
import { useHistory } from "react-router-dom";

function Landing() {
  const history = useHistory();
  const [form] = Form.useForm();

  const handleSubmitWrapper = async (payload) => {
    history.push(`/results/?city=${payload.city_name}&name=${payload.product_name}`);
  }
  return (
    <div className="landing-wrapper">
      <main>
        <div className='main-hero-wrapper'>
          <img src={logo} className="main-hero" alt='Smart Tweet' />
        </div>
        <Form
          className='landing-form-wrapper'
          form={form}
          onFinish={handleSubmitWrapper}
        >
          <Form.Item name='product_name' rules={[
            { required: true, message: "Please select a valid product name!" },
          ]}>
            <Input placeholder="Product Name" prefix={<SearchOutlined />} />
          </Form.Item>
          <Form.Item name='city_name' rules={[
            { required: true, message: "Please select a City!" },
          ]}>
            <Input placeholder="City Name" prefix={<ArrowUpOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary"
              htmlType="submit"
            >Look for Smart Tweets</Button>
          </Form.Item>
        </Form>
      </main>
      <br />
    </div>
  );
}

export default Landing;

