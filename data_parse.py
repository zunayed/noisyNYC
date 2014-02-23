import pandas as pd
from dateutil.parser import parse
from datetime import datetime

def load(fname):
    cols = ['Created Date', 'Incident Zip']
    df = pd.read_csv(fname, usecols=cols, parse_dates=['Created Date'])
    df = df.set_index('Created Date')

def munge(df):
    df = df.set_index('Created Date')

    df = df.replace("\D+", "0", regex=True)                     # remove nonnumeric Zip entries
    df = df.fillna("")                                          # remove NaN entries, cast to str
    df = df[df.astype(str)['Incident Zip'].apply(len) == 5]     # filter for 5 element zip codes
    df = df.to_period("M")                                      # make periodical index by month
    df = df.groupby(level=0)['Incident Zip'].value_counts()     # get reports per zip by month

    return df