import tweepy
import creds
from flask import Flask
from collections import Counter
from text_process import *
from flask_cors import CORS
from flask import request
import re
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})

class twitter_api:
    def __init__(self, creds):
        self.api = self.get_api(creds)


    def get_api(self, creds):
        "Returns accessible twitter api"
        auth = tweepy.OAuthHandler(creds.api_key, creds.api_secret)
        auth.set_access_token(creds.access_token, creds.access_token_secret)
        api = tweepy.API(auth, wait_on_rate_limit=True) 
        return api


    def search_tweets(self, product_name, query, cnt = 20, location=None):
        """
        Method to Search and extract tweets based on query, location
        Args:
            product_name: search tweets based on product_name
            query (list of str) : keywords similar to product
            cnt : number of tweets
            location (geocode) : specific region to focus while searching tweets
        Return:
            res (list): list of searched tweets'
        """
        query.append(product_name)
        searched_tweets = []
        searched_ids = []
        last_id = -1
        popular, recent = True, True
        while len(searched_tweets) < cnt:
            curr_cnt = cnt - len(searched_tweets)
            try:
                if popular:
                    tweets = self.api.search(q=query,
                                    lang="en",
                                    result_type="popular",
                                    count=curr_cnt,
                                    tweet_mode='extended',
                                    max_id=str(last_id - 1)
                                    )

                    if not tweets:
                        popular = False

                elif recent:
                    tweets = self.api.search(q=query,
                                lang="en",
                                result_type="mixed",
                                count=curr_cnt,
                                tweet_mode='extended',
                                max_id=str(last_id - 1)
                                )
                    if not tweets:
                        recent = False

                if (recent is False) and (popular is False):
                    break
                    
                for tweet in tweets:
                    if tweet._json['id'] not in searched_ids:
                        searched_ids.append(tweet._json['id'])
                        res = {}
                        res['id'] = "{}".format(tweet._json['id'])
                        res['text'] = tweet._json['full_text']
                        res['retweet_count'] = tweet._json['retweet_count']
                        res['favorite_count'] = tweet._json['favorite_count']
                        
                        searched_tweets.append(res)
                if tweets:
                    last_id = tweets[-1].id
            except tweepy.TweepError as e:
                break
        
        return searched_tweets
    
    def process_tweets(self, tweets):
        """
        Filter scraped tweets on ApunKaScore
        Args:
            tweets (list): list of scraped tweets
        Return:
            res_dict : {"id", "keywords", "hashtags", "emotions"}
        """
        # filter tweets
        
        # print('len tweets: '+str(len(tweets)))
        res_dict = {"id":[], "keywords":None}
        cnt = 0
        for tweet in tweets:
            cnt += 1
            if cnt%10==0:
                print(cnt)
            
            if tweet['retweet_count'] !=0 or tweet['favorite_count'] !=0:
                process_res = tweet['text']
            else:
                process_res = process(tweet['text'])
                if "error" in process_res.keys() or "warning" in process_res.keys() or "sentiment" not in process_res.keys():
                    print("Got an error!")
                    continue
                # 1. tweet sentiment is positive
                if process_res['sentiment']['document']['label'] == "negative" : 
                    continue

            res_dict['id'].append(tweet['id'])
        tweet_corpus = []
        for tweet in tweets:
            tweet_corpus.append(pre_process(tweet['text']))
        vectorizer = TfidfVectorizer(ngram_range=(1,2))
        X = vectorizer.fit_transform(tweet_corpus)
        impactfull_words = vectorizer.get_feature_names()[-5:]

        # # combining all tweets' text into one text body
        all_text = " ".join(tweet['text'] for tweet in tweets)
        all_text = all_text.lower()
        all_text_filtered = pre_process(all_text)
        process_text_res = process(all_text_filtered)
        emotions = process_text_res['emotion']['document']['emotion']
        res_dict['emotions'] = emotions

        count = Counter()
        if process_text_res['sentiment']['document']['label'] == "positive" :
            for keyword in process_text_res['keywords']:
                if keyword['relevance'] > 0.30:
                    count[keyword['text']]+=1

        impactfull_words1 = [words for (words, cnt) in count.most_common(5)]
        impactfull_words = impactfull_words1 + impactfull_words
        res_dict['keywords'] = impactfull_words
        
        hashtags = re.findall(r"#(\w+)", all_text)
        count = Counter()
        for tag in hashtags:
            count[tag]+=1
        impactfull_tags = [words for (words, cnt) in count.most_common(5)]
        res_dict['hashtags']=impactfull_tags

        return res_dict



@app.route('/', methods=['GET'])
def main():
    product_name = request.args.get('product_name')
    city_name = request.args.get('city_name')
    if product_name==None:
        return {
            'error': True,
            'message': 'Please enter a product name'
        }
    query = [] 
    count=20
    try:
        twitter = twitter_api(creds)
        print("------- Api init done! ----------")
        res = twitter.search_tweets(product_name=product_name, query=query, cnt=count)
        print("--------- Scraping done! --------")
        res = twitter.process_tweets(res)
        print("-------- text processing done!--------")
        return {
            'error': False,
            'data': {
                'keywords': res['keywords'][:6],
                'hashtags': res['hashtags'][:6],
                'tweets': res['id'][:6],
                'emotions': res['emotions']
            }
        }
    except Exception as inst:
        print(inst)
        return {
            'error': True,
            'message': 'Something went wrong'
        }

if __name__ == '__main__':
    app.run()