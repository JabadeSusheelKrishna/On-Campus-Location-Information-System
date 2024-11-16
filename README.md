# On-Campus-Location-Information-System

### How to Run The Webpage ?
> - Just open `index.html` with live server
> - Now access the webpage at your `localhost:5500`
>
### Using Docker

```
sudo docker pull doraemonpro/on-campus-location-information-system
```
```
sudo docker run -p 8000:8000 -p 3200:3200 my-python-servers
```

### Updates :
> - Added custom tiling of IIIT Campus
> - uncomment line 20 and comment out line 19 in `index.html`
> - need to create high resolution tiles
>  - also have structured layers of tiles

### Routing :
> - cd to the Routing directory
> - run the `parser.py` file to convert the GeoJSON data to graph nodes
> - If everything is alright, you should be able to see `graphs.json`
> - Now open the `index.html` with the live server.
> - Enter the input from and to as Node_<Number> and click on the route

### Team :
> - Jabade Susheel Krishna
> - Jagankrishna Nallasingu

### Professor :
> - Dr. K S Rajan

### Documents :
> - Mid-Presentation
> -  https://www.canva.com/design/DAGVucpfhlg/dKfKHV0URcvuZo01qiRW4A/edit
> -  Final-Presentation
> -  https://www.canva.com/design/DAGWm3QvVMU/hK3MbDqnWd9S7JEm9Rj32Q/edit?utm_content=DAGWm3QvVMU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
> -  Meeting Link :
> -  https://teams.microsoft.com/l/meetup-join/19%3ameeting_ZDIwZjk0Y2ItNzE2Yi00YjQ4LWJmYWQtZDY1YTA5NDUzNjg4%40thread.v2/0?context=%7b%22Tid%22%3a%22031a3bbc-cf7c-4e2b-96ec-867555540a1c%22%2c%22Oid%22%3a%2232c2fc04-8347-4708-8639-c0aa1c89af91%22%7d
