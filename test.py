import webapp2
from google.appengine.ext import db
from google.appengine.ext.webapp import template

class Image(db.Model):
	data = db.StringProperty()
	
class MainPage(webapp2.RequestHandler):
    def get(self):
        imgname=self.request.get('imagename')
        self.response.headers['content-Type'] = 'html'
        
        if imgname:
            key=db.Key.from_path('Image',imgname)
            keydata=db.get(key)
            
            if keydata:
                saved_image=keydata.data
                self.response.out.write(template.render("paint.html",{'saved':saved_image}));
            else:	
                self.response.out.write("""<script> alert("Image not found");	document.location.href="/" </script>""")
        else:
            self.response.out.write(template.render("paint.html",{}));
	        
    def post(self):
        imgname=self.request.get('imagename')
        imgdata=self.request.get('string')
        img=Image(key_name=imgname, data=imgdata)
        img.put();
	
app = webapp2.WSGIApplication([('/.*', MainPage)],debug=True)
