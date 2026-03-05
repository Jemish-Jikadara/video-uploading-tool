
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

            const data = new FormData(form)

            await fetch("/upload", {
                method: "POST",
                body: data
            })

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

