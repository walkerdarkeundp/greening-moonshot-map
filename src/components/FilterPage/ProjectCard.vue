<template>
  <div class="project-card">
    <div class="card-content">
      <div class="logo-container">
        <img :src="logoSrc" alt="Agency Logo" class="agency-logo" />
      </div>
      <div class="card-details">
        <h3>{{ project.title || "No title available" }}</h3>
        <p>
          <strong>Region:</strong> {{ project.region || "No region available" }}
        </p>
        <p>
          <strong>Country:</strong>
          {{ project.country || "No country available" }}
        </p>
        <p>
          <strong>Story:</strong>
          <a :href="project.story || ''" class="story-link"
            >Read the full story</a
          >
        </p>
        <div class="image-container">
          <a :href="project.story || ''" class="img-to-story-link">
            <img
              class="card-image"
              :src="currentImgSrc"
              :alt="project.country"
              @error="handleImageError"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from "@/assets/images/GreeningMoonshot.png";

export default {
  name: "ProjectCard",
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultImgSrc: defaultImage,
      currentImgSrc: null,
      possibleExtensions: ["jpg", "JPG", "jpeg", "png"],
    };
  },
  computed: {
    logoSrc() {
      return `${process.env.BASE_URL}logo/UNDP.png`;
    },
  },
  methods: {
    async tryLoadCountryImage() {
      for (const ext of this.possibleExtensions) {
        try {
          const countryImage = await import(
            `@/assets/images/${this.project.country}.${ext}`
          );
          return countryImage.default;
        } catch (e) {
          continue;
        }
      }
      return null;
    },
    async handleImageError() {
      if (this.currentImgSrc === this.project.image) {
        // If project.image failed, try country image
        const countryImage = await this.tryLoadCountryImage();
        if (countryImage) {
          this.currentImgSrc = countryImage;
        } else {
          // If country image not found, use default
          this.currentImgSrc = this.defaultImgSrc;
        }
      }
    },
    async initializeImage() {
      // Start with project.image if available
      this.currentImgSrc = this.project.image;

      // If no project.image, try country image
      if (!this.currentImgSrc) {
        const countryImage = await this.tryLoadCountryImage();
        this.currentImgSrc = countryImage || this.defaultImgSrc;
      }
    },
  },
  mounted() {
    this.initializeImage();
  },
};
</script>

<style scoped>
.project-card {
  box-shadow: 0 10px 60px rgba(7, 61, 125, 0.11);
  border: 1px solid rgba(214, 226, 240, 0.54);
  background-color: #fff;
  margin-bottom: 20px;
  padding: 15px;
  color: #3a3a3a;
  font-size: 18px;
  font-weight: 400;
}

.logo-container {
  width: 69.02px;
  height: 140px;
  flex-shrink: 0;
  margin-right: 40px;
  margin-left: 40px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agency-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-details {
  text-align: left;
  flex-grow: 1;
  width: 100%; /* Ensure card details take full width */
}

.image-container {
  width: 100%;
  margin-top: 15px;
  overflow: hidden;
  border-radius: 8px;
}

.card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  max-height: 430px; /* Prevent extremely tall images */
}

.project-card h3 {
  color: #0052b4;
  margin-top: 10px;
  margin-bottom: 20px;
}

.project-card p {
  margin-bottom: 0.5rem;
}

.project-card p strong {
  color: #0052b4;
}

.card-content {
  display: flex;
  align-items: flex-start;
}

.story-link {
  text-decoration: none;
}
</style>
