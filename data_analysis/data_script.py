import pandas as pd

pd.set_option('display.line_width', 4000)
pd.set_option('display.max_columns', 100)

orig_data = pd.read_csv('./311-service-requests.csv', nrows=200000, parse_dates=['Created Date'])
orig_data['Street Name'].fillna("", inplace=True) # This is replacing missing street names

brooklyn = orig_data[orig_data['Borough'] == 'BROOKLYN']
queens = orig_data[orig_data['Borough'] == 'QUEENS']
manhattan = orig_data[orig_data['Borough'] == 'MANHATTAN']
bronx = orig_data[orig_data['Borough'] == 'BRONX']

bk_noise = brooklyn[(brooklyn['Complaint Type'] == 'Noise - Street/Sidewalk') | (brooklyn['Complaint Type'] == 'Noise - Commercial')]
qn_noise = queens[(queens['Complaint Type'] == 'Noise - Street/Sidewalk') | (queens['Complaint Type'] == 'Noise - Commercial')]
man_noise = manhattan[(manhattan['Complaint Type'] == 'Noise - Street/Sidewalk') | (manhattan['Complaint Type'] == 'Noise - Commercial')]
bx_noise = bronx[(bronx['Complaint Type'] == 'Noise - Street/Sidewalk') | (bronx['Complaint Type'] == 'Noise - Commercial')]

qn_noise['Incident Zip'].value_counts()[:10].to_csv('qn_noise', sep=',',header = True, index = True)
bk_noise['Incident Zip'].value_counts()[:10].to_csv('bk_noise', sep=',',header = True, index = True)
man_noise['Incident Zip'].value_counts()[:10].to_csv('man_noise', sep=',',header = True, index = True)
bx_noise['Incident Zip'].value_counts()[:10].to_csv('bx_noise', sep=',',header = True, index = True)


orig_data['Complaint Type'].value_counts()[:30].to_csv('top_complaints')