from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class Member(AbstractUser):
    premium = models.BooleanField(default=False)
    bio = models.CharField(max_length=1000, null=True, blank=True)

    def has_purchased_book(self, book):
        for chapter in book.chapters.all():
            if not self.has_purchased_chapter(chapter):
                return False
        if len(book.chapters.all()) == 0:
            return False
        return True

    def has_purchased_chapter(self, chapter):
        from store.models import PurchaseHistory
        return PurchaseHistory.objects.filter(member=self, chapter=chapter).exists()

    def get_bought_books(self):
        from store.models import Book
        books = []
        for book in Book.objects.all():
            if self.has_purchased_book(book):
                books.append(book)
        return books

    def get_bought_chapters(self):
        from store.models import PurchaseHistory, Chapter
        return Chapter.objects.filter(
            id__in=PurchaseHistory.objects.filter(member=self).values('chapter'))

    def is_able_to_ask(self):
        from QA.models import Question
        if self.premium:
            return True
        return Question.objects.filter(creator=self).count() < settings.QUESTION_LIMIT

    def get_asked_questions(self):
        from QA.models import Question
        return Question.objects.filter(creator=self)

    def get_replied_questions(self):
        from QA.models import Question, Reply
        replies = Reply.objects.filter(creator=self).values('question')
        return Question.objects.filter(id__in=replies)

    def get_replies(self):
        from QA.models import Reply
        return Reply.objects.filter(creator=self)

    def get_messages(self):
        from authentication.models import Message
        return Message.objects.filter(to=self)


class Message(models.Model):
    text = models.TextField()
    to = models.ForeignKey(Member, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return "{} - {}".format(self.text, self.to)
