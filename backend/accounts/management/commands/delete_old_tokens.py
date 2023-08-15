from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

class Command(BaseCommand):
    help = 'Removes blacklisted tokens older than a specified age'

    def add_arguments(self, parser):
        parser.add_argument('--days', type=int, default=30)

    def handle(self, *args, **options):
        days = options['days']
        cutoff_time = timezone.now() - timedelta(days=days)
        tokens = BlacklistedToken.objects.filter(blacklisted_at__lt=cutoff_time)
        token_count = tokens.count()
        tokens.delete()

        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {token_count} blacklisted tokens older than {days} days'))
