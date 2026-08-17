(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggleBtn = document.getElementById("theme-toggle");
  var stored = localStorage.getItem("theme");
  if (stored) root.setAttribute("data-theme", stored);

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- Publications data ---------- */
  var publications = [
    {
      title: "Knowledge Distillation in Quantum Neural Network using Approximate Synthesis",
      url: "https://arxiv.org/pdf/2207.01801.pdf",
      authors: ["Mahabubul Alam", "Satwik Kundu", "Swaroop Ghosh"],
      venue: "IEEE/ACM Asia and South Pacific Design Automation Conference",
      abbr: "ASP-DAC",
      year: 2023
    },
    {
      title: "QNet: A Scalable and Noise-resilient Quantum Neural Network Architecture for Noisy Intermediate-Scale Quantum Computers",
      url: "https://www.frontiersin.org/articles/10.3389/fphy.2021.755139/abstract",
      authors: ["Mahabubul Alam", "Swaroop Ghosh"],
      venue: "Frontiers in Physics, Quantum Engineering and Technology",
      abbr: "",
      year: 2022
    },
    {
      title: "Quantum-Classical Hybrid Machine Learning for Image Classification: Invited Paper",
      url: "https://arxiv.org/pdf/2109.02862.pdf",
      authors: ["Mahabubul Alam", "Satwik Kundu", "Rasit Onur Topaloglu", "Swaroop Ghosh"],
      venue: "IEEE/ACM International Conference on Computer Aided Design",
      abbr: "ICCAD",
      year: 2021
    },
    {
      title: "Drug Discovery Approaches using Quantum Machine Learning: Invited Paper",
      url: "https://arxiv.org/pdf/2104.00746.pdf",
      authors: ["Junde Li", "Mahabubul Alam", "Congzhou M Sha", "Jian Wang", "Nikolay V. Dokholyan", "Swaroop Ghosh"],
      venue: "IEEE/ACM Design Automation Conference",
      abbr: "DAC",
      year: 2021
    },
    {
      title: "Circuit Compilation Methodologies for Quantum Approximate Optimization Algorithm",
      url: "https://par.nsf.gov/servlets/purl/10292780",
      authors: ["Mahabubul Alam", "Abdullah Ash-Saki", "Swaroop Ghosh"],
      venue: "IEEE/ACM International Symposium on Microarchitecture",
      abbr: "MICRO",
      year: 2020
    },
    {
      title: "Noise Resilient Compilation Policies for Quantum Approximate Optimization Algorithm: Invited Paper",
      url: "https://whova.com/xems/whova_backend/get_event_s3_file_api/?eventkey=e1e7d48028ad92bc62772c4099fcd8739e34ccd05947050aa9ed15f33dd5df95&event_id=iccad_202011&file_url=https://whova.com/xems/whova_backend/get_event_s3_file_api/?event_id=iccad_202011&eventkey=e1e7d48028ad92bc62772c4099fcd8739e34ccd05947050aa9ed15f33dd5df95&file_url=https://d1keuthy5s86c8.cloudfront.net/static/ems/upload/files/lgbvy_11D_5.pdf",
      authors: ["Mahabubul Alam", "Abdullah Ash-Saki", "Junde Li", "Anupam Chattopadhyay", "Swaroop Ghosh"],
      venue: "IEEE/ACM International Conference on Computer Aided Design",
      abbr: "ICCAD",
      year: 2020
    },
    {
      title: "Experimental Characterization, Modeling, and Analysis of Crosstalk in a Quantum Computer",
      url: "https://ieeexplore.ieee.org/document/9193969",
      authors: ["Abdullah Ash-Saki", "Mahabubul Alam", "Swaroop Ghosh"],
      venue: "IEEE Transactions on Quantum Engineering (TQE)",
      abbr: "TQE",
      year: 2020
    },
    {
      title: "Analysis of crosstalk in NISQ devices and security implications in multi-programming regime",
      url: "https://dl.acm.org/doi/10.1145/3370748.3406570",
      authors: ["Abdullah Ash-Saki", "Mahabubul Alam", "Swaroop Ghosh"],
      venue: "IEEE/ACM International Symposium on Low Power Electronics and Design",
      abbr: "ISLPED",
      year: 2020
    },
    {
      title: "Resiliency analysis and improvement of variational quantum factoring in superconducting qubit",
      url: "https://dl.acm.org/doi/abs/10.1145/3370748.3406586",
      authors: ["Ling Qiu", "Mahabubul Alam", "Abdullah Ash-Saki", "Swaroop Ghosh"],
      venue: "IEEE/ACM International Symposium on Low Power Electronics and Design",
      abbr: "ISLPED",
      year: 2020
    },
    {
      title: "An Efficient Circuit Compilation Flow for Quantum Approximate Optimization Algorithm",
      url: "https://ieeexplore.ieee.org/abstract/document/9218558",
      authors: ["Mahabubul Alam", "Abdullah Ash-Saki", "Swaroop Ghosh"],
      venue: "IEEE/ACM Design Automation Conference",
      abbr: "DAC",
      year: 2020
    },
    {
      title: "Design-Space Exploration of Quantum Approximate Optimization Algorithm under Noise",
      url: "https://ieeexplore.ieee.org/document/9075903",
      authors: ["Mahabubul Alam", "Abdullah Ash-Saki", "Swaroop Ghosh"],
      venue: "IEEE Custom Integrated Circuits Conference",
      abbr: "CICC",
      year: 2020
    },
    {
      title: "Accelerating Quantum Approximate Optimization Algorithm using Machine Learning",
      url: "https://ieeexplore.ieee.org/document/9116348",
      authors: ["Mahabubul Alam", "Abdullah Ash-Saki", "Swaroop Ghosh"],
      venue: "Design Automation and Test in Europe",
      abbr: "DATE",
      year: 2020
    },
    {
      title: "Improving Reliability of Quantum True Random Number Generator using Machine Learning",
      url: "https://ieeexplore.ieee.org/document/9137054",
      authors: ["Abdullah Ash-Saki", "Mahabubul Alam", "Swaroop Ghosh"],
      venue: "International Symposium on Quality Electronic Design",
      abbr: "ISQED",
      year: 2020
    },
    {
      title: "MUQUT: Multi-Constraint Quantum Circuit Mapping on NISQ Computers: Invited Paper",
      url: "https://ieeexplore.ieee.org/document/8942132",
      authors: ["Debjyoti Bhattacharjee", "Abdullah Ash-Saki", "Mahabubul Alam", "Anupam Chattopadhyay", "Swaroop Ghosh"],
      venue: "IEEE/ACM International Conference on Computer Aided Design",
      abbr: "ICCAD",
      year: 2019
    },
    {
      title: "Addressing Temporal Variations in Qubit Quality Metrics for Parameterized Quantum Circuits",
      url: "https://ieeexplore.ieee.org/document/8824907",
      authors: ["Mahabubul Alam", "Abdullah Ash-Saki", "Swaroop Ghosh"],
      venue: "IEEE/ACM International Symposium on Low Power Electronics and Design",
      abbr: "ISLPED",
      year: 2019
    },
    {
      title: "QURE: Qubit Re-allocation in Noisy Intermediate-Scale Quantum Computers",
      url: "https://ieeexplore.ieee.org/document/8806892",
      authors: ["Abdullah Ash-Saki", "Mahabubul Alam", "Swaroop Ghosh"],
      venue: "IEEE/ACM Design Automation Conference",
      abbr: "DAC",
      year: 2019
    },
    {
      title: "Robust, low-cost, and accurate detection of recycled ICs using digital signatures",
      url: "https://ieeexplore.ieee.org/document/8383917",
      authors: ["Mahabubul Alam", "Sreeja Chowdhury", "Mark Tehranipoor", "Ujjwal Guin"],
      venue: "IEEE International Symposium on Hardware Oriented Security and Trust",
      abbr: "HOST",
      year: 2018
    }
  ];

  /* ---------- Render ---------- */
  var listEl = document.getElementById("pub-list");
  var countEl = document.getElementById("pub-count");
  var emptyEl = document.getElementById("pub-empty");
  var searchEl = document.getElementById("pub-search-input");

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderAuthors(authors) {
    return authors
      .map(function (a) {
        var safe = escapeHtml(a);
        return a === "Mahabubul Alam" ? '<span class="me">' + safe + "</span>" : safe;
      })
      .join(", ");
  }

  function renderPublications() {
    var frag = document.createDocumentFragment();
    publications.forEach(function (pub, i) {
      var li = document.createElement("li");
      li.className = "pub-item";
      li.dataset.search = (pub.title + " " + pub.authors.join(" ") + " " + pub.venue + " " + pub.abbr + " " + pub.year).toLowerCase();
      li.innerHTML =
        '<a class="pub-title" href="' + pub.url + '" target="_blank" rel="noopener">' + escapeHtml(pub.title) + "</a>" +
        '<p class="pub-authors">' + renderAuthors(pub.authors) + "</p>" +
        '<p class="pub-venue">' + escapeHtml(pub.venue) + ", " + pub.year + "</p>";
      frag.appendChild(li);
    });
    listEl.appendChild(frag);
    if (countEl) countEl.textContent = publications.length + " publications";
  }

  renderPublications();

  /* ---------- Search / filter ---------- */
  function applyFilter(query) {
    var q = query.trim().toLowerCase();
    var items = listEl.querySelectorAll(".pub-item");
    var visible = 0;
    items.forEach(function (item) {
      var match = !q || item.dataset.search.indexOf(q) !== -1;
      item.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });
    if (emptyEl) emptyEl.classList.toggle("show", visible === 0);
    if (countEl) countEl.textContent = visible + " of " + publications.length + " publications";
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      applyFilter(searchEl.value);
    });
  }

  document.querySelectorAll(".hint-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var term = chip.dataset.term || "";
      if (searchEl) {
        searchEl.value = term;
        searchEl.focus();
      }
      applyFilter(term);
    });
  });

  /* ---------- Scroll reveal ---------- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".pub-item").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".pub-item").forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
