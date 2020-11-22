import torch
import transformers
from transformers import XLNetForSequenceClassification, XLNetTokenizer, XLNetConfig
  
import re
import emoji
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords


class Model:
    def __init__(self, path, max_len=120):
        self.model = self.loadModel(path)
        self.maxlen = max_len
        self.tokenizer = XLNetTokenizer.from_pretrained('xlnet-base-cased')


    def loadModel(self, filepath):
        """
        -Function to load model with saved states(parameters)
        -Args:
            filpath (str): path to the saved model
        -Return:
            model
        """
        saved = torch.load(filepath, map_location='cpu')
        state_dict = saved['state_dict']
        config = XLNetConfig(num_labels = 2)
        model = XLNetForSequenceClassification(config)
        # loading the trained parameters with model
        model.load_state_dict(state_dict)
        return model

    def getTokens(self, text):
        tokens_dict = self.tokenizer.encode_plus(text = text,
                            add_special_tokens=True,
                            max_length = self.maxlen,
                            pad_to_max_length=True,
                            return_attention_mask=True)

        token_id = torch.tensor(tokens_dict['input_ids'])
        attn_mask = torch.tensor(tokens_dict['attention_mask'])

        return token_id, attn_mask


    def predict(self, text):
        """
        Functiion to predict sentiment
        Args:
            text (str): text
        Returns:
            prediction (str): sentiment           
        """
        processed_text = textPreProcess(text)
        # get tokens and attention mask for text
        tokens, attn_mask = self.getTokens(text)
        output = self.model(tokens.unsqueeze(0),
                            attention_mask = attn_mask.unsqueeze(0))
        prediction = output[0].argmax()
        if prediction == 1 :
            prediction = "positive"
        else:
            prediction = "negative"
        return prediction


def textPreProcess(text, rem_stop=True):
    """
    Function to process text data and remove unneccessary information
    1. converting emojis to text
    2. lower casing
    3. removing punctuations, urls
    4. removing stop words
    5. lemmatization 
    Args:
        text (str): text data
        rem_stop (bool): whether to remove stopping words or not
    Return:
        text (str): processed text data
    """
    text = emoji.demojize(text)
    text = text.strip().lower()
    PUNCTUATIONS = r'[!()\-[\]{};:"\,<>/?@#$%^&.*_~]'
    text = re.sub(PUNCTUATIONS, "", text)
    urlPattern = re.compile(r'https?://\S+|www\.\S+')
    urlPattern.sub('', text)

    # updating stopping words list
    if rem_stop:
        stopWords = list(stopwords.words('english'))
    else:
        stopWords = []

    lemmaWords=[]
    Lemma=WordNetLemmatizer()
    for word in text.split():
        if word not in stopWords:
            lemmaWords.append(Lemma.lemmatize(word.strip()))
    text = " ".join(lemmaWords)

    return text