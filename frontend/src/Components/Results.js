import { Button, Input, message, Typography, Grid, Form, Alert, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "../assets/css/results.styles.css";
import { handleSubmit } from "../utils/main";
import Head from "./Head";
import { TwitterTweetEmbed } from 'react-twitter-embed';


function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}


function Results() {
  const { md } = Grid.useBreakpoint();
  const location = useLocation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [validResults, setvalidResults] = useState(false);
  const [loading, setloading] = useState(false);

  const colors = ['magenta', 'red', 'volcano', 'orange', 'cyan', 'blue', 'geekblue', 'purple']

  const [data, setData] = useState();

  useEffect(() => {
    const data = location.search;
    let params = new URLSearchParams(data);
    let city = params.get("city") ?? "";
    let prodName = params.get("name") ?? "";

    form.setFieldsValue({
      'city_name': city,
      'product_name': prodName
    })
    if (prodName === "") {
      message.error(
        `Invalid product name`,
        4
      );
      setvalidResults(false);
    } else {
      // fetch data
      setvalidResults(true);
      setloading(true);
      handleSubmit(prodName, city).then(e => {
        // show the results
        if (e.error === true) {
          throw Error(e.message);
        } else {
          setData(e.data);
          setloading(false)
        }
      }).catch(e => {
        message.error(e.message, 2);
        setloading(false);
      });
    }
  }, [location.search])


  const handleSubmitWrapper = async (payload) => {
    history.push(`/results/?city=${payload.city_name}&name=${payload.product_name}`);
  }

  return (
    <div className="results-wrapper">
      <Head />
      <br />
      <main>
        <Form
          form={form}
          layout={md ? 'inline' : 'vertical'}
          className=''
          onFinish={handleSubmitWrapper}
        >
          <Form.Item label='Name' name='product_name' rules={[
            { required: true, message: "Please select a valid product name!" },
          ]}>
            <Input placeholder="Product Name" />
          </Form.Item>
          <Form.Item label='Location' name='city_name'>
            <Input placeholder="City Name" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              htmlType="submit"
              type="primary">Look for Smart Tweets</Button>
          </Form.Item>
        </Form>

        <br />
        <br />
        {validResults && (!loading) ? <>
          <div className='keywords-results'>
            <div className='heading'>Keywords</div>
            {!data || data['keywords'].length === 0 ?
              <>
                <Alert message='Sorry no keywords found' type='warning' />
                <br />
              </>
              :
              <>
                <Alert message="Based on the tweets fetched around the location here are some of the keywords we highly recommend you to use in your next tweet." type="info" />
                <br />

                {data['keywords'].map((e, index) => {
                  let key = Math.floor(Math.random() * (colors.length));
                  return (
                    <Tag key={index} color={colors[key]}>{toTitleCase(e)}</Tag>
                  )
                })}
              </>}
          </div>
          <br />

          <br />

          <div className='tweets-results'>
            <div className='heading'>Retweets Suggestions</div>
            {!data || data['tweets'].length === 0 ?
              <>
                <Alert message='Sorry no retweets suggestions found' type='warning' />
                <br />
              </>
              :
              <>
                <Alert message="We find the following tweets very cool and you should consider re-tweeting them." type="info" />
                <br />
                <div className='tweets-wrapper'>

                  {data['tweets'].map((e, index) => {
                    return (
                      <div key={index}>
                        <TwitterTweetEmbed
                          tweetId={e}
                        />
                      </div>
                    )

                  })}
                </div>

              </>}
          </div>
        </> : <>
            {loading ? <div style={{ 'textAlign': 'center', marginTop: '10px' }}><Spin size='large' tip='Fetching smart tweets...'></Spin></div> :
              <>
                <Alert message="Some parameters are missing. Please consider trying with a valid product name and city" type="error" />
                <br />
              </>}
          </>}
      </main>
      <br />
    </div>
  );
}

export default Results;

