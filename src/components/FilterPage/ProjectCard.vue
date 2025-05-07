<template>
  <div class="project-card">
    <div class="card-content">
      <div class="logo-container">
        <img :src="logoSrc" alt="Agency Logo" class="agency-logo">
      </div>
      <div class="card-details">
        <h3>{{ project.title || 'No title available' }}</h3>
        <p><strong>Country:</strong> {{ project.country || 'No country available' }}</p>
        <p><strong>Story:</strong> <a :href="project.story || ''" class="story-link">{{ project.story || 'No country available' }}</a></p>
        <!-- <p><strong>Topic:</strong> {{ project.topic || 'No topic available' }}</p>
        <p><strong>Partner:</strong> {{ project.partner || 'No partner available' }}</p>
        <p><strong>Stakeholders:</strong> {{ project.stakeholders || 'No stakeholders available' }}</p>
        <p><strong>Budget:</strong> {{ project.budget || 'No budget available' }}</p>
        <p><strong>Completion date:</strong> {{ project.completion_date || 'No completion date available' }}</p>
        <p><strong>Description:</strong> {{ project.description || 'No description available' }}</p> -->
        <img :src="project.image || ''" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectCard",
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    logoSrc() {
      return `${process.env.BASE_URL}logo/UNDP.png`;
    }
  }
};
</script>

<style scoped>
.project-card {
  box-shadow: 0 10px 60px rgba(7,61,125,.11);
  border: 1px solid rgba(214,226,240,.54);
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
