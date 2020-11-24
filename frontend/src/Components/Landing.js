import React, { useState } from "react";
import "../assets/css/landing.styles.css";
import { Button, Input, Form, AutoComplete } from "antd";
import { SearchOutlined, ArrowUpOutlined } from '@ant-design/icons';
import logo from '../assets/logo/main.png';
import { useHistory } from "react-router-dom";

function Landing({ cities, brands }) {
  const history = useHistory();
  const [form] = Form.useForm();

  const handleSubmitWrapper = async (payload) => {
    history.push(`/results/?city=${payload.city_name}&name=${payload.product_name}`);
  }


  const onChangeHandler = (key, value) => {
    let newObject = {};
    newObject[key] = value;
    form.setFieldsValue(newObject);
  };

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
          <Form.Item
            name='product_name' rules={[
              { required: true, message: "Please select a valid product name!" },
            ]}>
            <AutoInput
              cities={brands}
              placeholder="Product Name"
              classNme="product_name"
              onChangeHandler={onChangeHandler}
              prefix={<SearchOutlined />}
            />
          </Form.Item>
          <Form.Item name='city_name'>
            <AutoInput
              cities={cities}
              placeholder="City Name"
              classNme="city_name"
              onChangeHandler={onChangeHandler}
              prefix={<ArrowUpOutlined />}
            />
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



const { Option } = AutoComplete;

export const AutoInput = ({ cities, classNme, placeholder, onChangeHandler, initialVal }) => {
  const [result, setResult] = useState([]);
  const handleSearch = (value) => {
    let res = [];
    if (!value) {
      res = [];
    } else {
      res = cities.filter((e) => {
        return e.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      });
    }
    setResult(res);
  };
  return (
    <AutoComplete
      onChange={(e) => onChangeHandler(classNme, e)}
      onSearch={handleSearch}
      placeholder={placeholder}
      className={classNme}
      style={{textAlign: 'left'}}
      inputValue={initialVal??''}
    >
      {result.map((value) => (
        <Option key={value} value={value}>
          {value}
        </Option>
      ))}
    </AutoComplete>
  );
};


