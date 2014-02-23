import requests
from datetime import date
from login import keys


def get_pages(start_date=(date(2010, 1, 1))):
    max_pages = 200
    limit = 1000
    base_url = 'http://data.cityofnewyork.us/resource/pq25-vtyu.json?$'
    start_date_range = start_date
    month = start_date.month
    end_date_range = start_date.replace(month=(month + 1))
    today = date.today()
    params = {
        'app_token': str(keys['socrata']),
        'offset': str(0),
        'limit': str(limit)
    }

    data = []
    while start_date_range <= today:
        where = 'created_date%3E=%27{0}%27+AND+created_date%3C%27{1}%27'.format(start_date_range, end_date_range)
        params['where'] = where
        for i in range(max_pages):
            # print('GET: {0} {1}'.format(base_url, params))
            # print(i)
            params['offset'] = str(i * limit)
            URL = Build_URL(base_url, params)
            new_data = get_page(URL)
            data.extend(new_data)
            if len(new_data) < limit:
                break
        start_date_range = end_date_range
        month += 1
        end_date_range = end_date_range.replace(month=month)
    return data


def get_page(url):
    try:
        r = requests.get(url)
        # print(r.url)
        return r.json()
    except Exception as e:
        print('Error getting: {}'.format(url))
        return None

'''
example
http://data.cityofnewyork.us/resource/pq25-vtyu.json?$$app_token=xxx$offset=83000&$limit=1000&$where=created_date%3E=%272014-02-01%27+AND+created_date%3C%272014-03-01%27
'''


def Build_URL(base_url, params):
    URL = base_url + '$app_token={0}&$offset={1}&$limit={2}&$where={3}'.format(params['app_token'], params['offset'], params['limit'], params['where'])
    return URL
