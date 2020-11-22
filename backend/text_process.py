import json
import requests
from requests.auth import HTTPBasicAuth
import re

def get_json(tweet):
    "Defines parameters for the watson API request"
    data = {
        "text": "{}".format(tweet),
        "features": {
            "entities": {
                "sentiment": True,
                "limit": 5
            },
            "keywords": {
                "sentiment": True,
                "limit": 5
            },
            "sentiment":{
                "document": True
            },
            "emotion": {
                "document": True
            }
        }
    }
    data = json.dumps(data)
    return data

def pre_process(text):
    """
    Args: 
        all tweets combined
    Return:
        tweets with @mentions and urls removed
    """
    #remove @mentions
    text = re.sub(r"@([a-z]|[0-9]|[A-Z]|[_])*", '',text)
    #remove external URLs
    text = re.sub(r'https?:\/\/.*[\r\n]*', '', text, flags=re.MULTILINE)
    return text

def process(tweet):
    """
    Process tweet text using IBM Watson NLU API.

    Args:
        tweets (list)
    Return:
        text sentiment, text keyword info, text entities' info
    """
    url = "https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/d1dbaa08-93ca-4f29-81e4-8cc98f250ba7/v1/analyze?version=2019-07-12"
    headers = {"Content-Type": "application/json"}
    data = get_json(tweet)
    auth = HTTPBasicAuth('apikey', '2YWxkOQMdI-7s7tvHJeGoXd_IsLK01G2OLbeBWDnW87n')
    res = requests.post(url, headers = headers, data=data, auth=auth)
    res = res.json()
    return res
