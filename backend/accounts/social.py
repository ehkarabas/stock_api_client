from datetime import datetime
import pytz
import requests
from .serializers import add_permissions_to_tester_group
from django.contrib.auth.models import Group

def save_profile(backend, user, response, *args, **kwargs):
    url = None
    if backend.name == 'google-oauth2':
        if 'picture' in response:
            url = response['picture']
    elif backend.name == 'facebook':
        if 'picture' in response and 'data' in response['picture']:
            url = response['picture']['data']['url']
    elif backend.name == 'github':
        if 'avatar_url' in response:
            url = response['avatar_url']
    
    if url:
        user.image = url

    if backend.name == "linkedin-oauth2":
        url = 'https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))'
        headers = {'Authorization': 'Bearer ' + response['access_token']}
        res = requests.get(url, headers=headers)
        
        if res.status_code == 200:
            
            linkedin_response = res.json()

            picture_urls = linkedin_response.get('profilePicture', {}).get('displayImage~', {}).get('elements', [])

            if picture_urls:
                highest_res_picture = picture_urls[-1]
                picture_url = highest_res_picture.get('identifiers', [{}])[-1].get('identifier')

                user.image = picture_url

    user_about = None
    if backend.name == 'google-oauth2':
        if 'name' in response and 'locale' in response:
            user_about = f"{response['name']}, {response['locale']}"
    elif backend.name == 'facebook':
        if 'first_name' in response and 'last_name' in response:
            user_about = f"{response['first_name']} {response['last_name']}"
    elif backend.name == 'github':
        if 'name' in response and 'bio' in response:
            
            created_at = datetime.strptime(response['created_at'], '%Y-%m-%dT%H:%M:%SZ')

            created_at_utc = pytz.utc.localize(created_at)

            turkey_tz = pytz.timezone('Europe/Istanbul')
            created_at_tr = created_at_utc.astimezone(turkey_tz)

            created_at_str = created_at_tr.strftime('%Y-%m-%d %H:%M:%S')

            user_about = (f"{response['name']}: {response['bio']} / "
                          f"Public Repos: {response['public_repos']} / "
                          f"Followers: {response['followers']} / "
                          f"Following: {response['following']} / "
                          f"Account Created At: {created_at_str}")
    elif backend.name == 'linkedin-oauth2':
        if 'firstName' in response and 'lastName' in response:
            
            locale = response['firstName']['preferredLocale']['language'] + "_" + response['firstName']['preferredLocale']['country']
            user_about = f"{response['firstName']['localized'][locale]} {response['lastName']['localized'][locale]}"

    if user_about:
        user.about = user_about

    if backend.name == 'linkedin-oauth2':
        if 'emailAddress' in response:
            user.email = response['emailAddress']

    add_permissions_to_tester_group()

    tester_group = Group.objects.get(name='Tester')

    user.groups.add(tester_group)

    user.save()
