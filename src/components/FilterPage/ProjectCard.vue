<template>
  <div class="project-card">
    <div class="card-content">
      <img :src="'/logo/' + project.agency + '.png'" alt="Agency Logo" class="agency-logo">
      <div class="card-details">
        <h3>{{ project.title || 'No title available' }}</h3>
        <p><strong>Country:</strong> {{ project.country || 'No country available' }}</p>
        <p><strong>Topic:</strong> {{ project.topic || 'No topic available' }}</p>
        <p><strong>Partner:</strong> {{ project.partner || 'No partner available' }}</p>
        <p><strong>Stakeholders:</strong> {{ project.stakeholders || 'No stakeholders available' }}</p>
        <p><strong>Budget:</strong> {{ project.budget || 'No budget available' }}</p>
        <p><strong>Completion Date:</strong> {{ project.completion_date || 'No completion date available' }}</p>
        <p><strong>Focal Point (Korea):</strong> {{ project.focal_point_korea || 'No focal point in Korea available' }}</p>
        <p><strong>Focal Point (Country):</strong> {{ project.focal_point_country || 'No focal point in country available' }}</p>
        <p><strong>Description:</strong> {{ project.description || 'No description available' }}</p>
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
  display: flex;
  align-items: center;
}

.agency-logo {
  width: 140px;
  height: 140px;
  margin-right: 40px;
  margin-left: 40px;
  margin-top: 10px;
}

.card-details {
  text-align: left;
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
  align-items: top;
}
</style>