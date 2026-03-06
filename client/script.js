
        const role = localStorage.getItem("role")

        if (role !== "host") {
            document.querySelector(".upload-box").style.display = "none"
        }



        function goLogin() {
            window.location = "login.html"
        }

        function logout() {
            localStorage.removeItem("role")
            location.reload()
        }

        function updateNavbar() {

            const role = localStorage.getItem("role")

            const navUser = document.getElementById("navUser")

            if (role) {

                navUser.innerHTML = `
  <span>${role}</span>
  <button onclick="logout()">Logout</button>
  `

            } else {

                navUser.innerHTML = `
  <button onclick="goLogin()">Login</button>
  `

            }

        }

        updateNavbar()


      const form = document.getElementById("uploadForm")

        form.addEventListener("submit", async (e) => {

            e.preventDefault()

           const xhr = new XMLHttpRequest()

xhr.open("POST","/upload",true)

document.getElementById("progressBox").style.display="block"

xhr.upload.onprogress = function(e){

 if(e.lengthComputable){

  const percent = Math.round((e.loaded/e.total)*100)

  document.getElementById("progressBar").value = percent

  document.getElementById("percent").innerText = percent + "%"

 }

}

xhr.onload = function(){

 alert("Uploaded")

 document.getElementById("progressBox").style.display="none"

 loadVideos()

}

xhr.send(data)

            alert("Uploaded")

            loadVideos()

        })

        async function deleteVideo(id) {

            await fetch("/delete/" + id, {
                method: "DELETE"
            })

            loadVideos()

        }

        async function addView(id) {

            await fetch("/view/" + id, {
                method: "POST"
            })

        }

        async function loadVideos() {

            const res = await fetch("/videos")

            const videos = await res.json()

            const container = document.getElementById("videos")

            container.innerHTML = ""

            videos.forEach(v => {

                let deleteBtn = ""

                if (role === "host") {
                    deleteBtn = `<button onclick="deleteVideo('${v._id}')">Delete</button>`
                }

                container.innerHTML += `

 <div class="video-card">

 <h3>${v.title}</h3>

 <video controls onclick="addView('${v._id}')">
 <source src="/video/${v.filename}">
 </video>

 <p>${v.description}</p>

 <p>Views: ${v.views}</p>

  <button ><a href="/download/${v.filename}">Download</a></button>

 ${deleteBtn}

 </div>

 `

            })

        }

        loadVideos()

