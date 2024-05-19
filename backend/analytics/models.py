from django.db import models


class Campaign(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Offer(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='offers')
    name = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Click(models.Model):
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='clicks')
    user_ip = models.GenericIPAddressField()
    user_agent = models.CharField(max_length=255)
    os = models.CharField(max_length=50)
    browser = models.CharField(max_length=50)
    click_time = models.DateTimeField(auto_now_add=True)
    landing_page_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Click by {self.user_ip} on {self.click_time}'


class Lead(models.Model):
    click = models.OneToOneField(Click, on_delete=models.CASCADE, related_name='lead')
    lead_time = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Lead created from click on {self.click.click_time}'
