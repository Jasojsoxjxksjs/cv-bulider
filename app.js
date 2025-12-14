// ============================================
// CV Builder - Application Logic
// ============================================

// State Management
const state = {
    experiences: [],
    education: [],
    skills: [],
    currentTemplate: 'modern',
    currentPage: 1,
    totalPages: 5
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadFromLocalStorage();
    addInitialSections();
});

function initializeApp() {
    console.log('CV Builder initialized');

    // Load selected template from localStorage
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
        changeTemplate(selectedTemplate);
    }
}

function addInitialSections() {
    // Add one experience and education section by default
    addExperienceSection();
    addEducationSection();
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Form inputs - real-time preview
    document.getElementById('fullName').addEventListener('input', updatePreview);
    document.getElementById('jobTitle').addEventListener('input', updatePreview);
    document.getElementById('email').addEventListener('input', updatePreview);
    document.getElementById('phone').addEventListener('input', updatePreview);
    document.getElementById('location').addEventListener('input', updatePreview);
    document.getElementById('website').addEventListener('input', updatePreview);
    document.getElementById('summary').addEventListener('input', updatePreview);
    document.getElementById('certifications').addEventListener('input', updatePreview);
    document.getElementById('languages').addEventListener('input', updatePreview);

    // Dynamic sections
    document.getElementById('addExperience').addEventListener('click', addExperienceSection);
    document.getElementById('addEducation').addEventListener('click', addEducationSection);

    // Skills
    document.getElementById('addSkill').addEventListener('click', addSkill);
    document.getElementById('skillInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });

    // Template selection
    document.querySelectorAll('.template-option').forEach(option => {
        option.addEventListener('click', (e) => {
            changeTemplate(e.currentTarget.dataset.template);
        });
    });

    // Controls
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
    document.getElementById('saveData').addEventListener('click', saveToLocalStorage);
    document.getElementById('loadData').addEventListener('click', loadFromLocalStorage);
    document.getElementById('clearData').addEventListener('click', clearAllData);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Multi-page navigation
    document.getElementById('nextBtn').addEventListener('click', nextPage);
    document.getElementById('prevBtn').addEventListener('click', prevPage);

    // Progress step clicks
    document.querySelectorAll('.progress-step').forEach(step => {
        step.addEventListener('click', () => {
            const targetPage = parseInt(step.dataset.step);
            goToPage(targetPage);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && state.currentPage < state.totalPages) {
            nextPage();
        } else if (e.key === 'ArrowLeft' && state.currentPage > 1) {
            prevPage();
        }
    });
}

// ============================================
// Multi-Page Navigation
// ============================================
function nextPage() {
    if (state.currentPage < state.totalPages) {
        goToPage(state.currentPage + 1);
    }
}

function prevPage() {
    if (state.currentPage > 1) {
        goToPage(state.currentPage - 1);
    }
}

function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > state.totalPages) return;

    // Hide current page
    const currentPageEl = document.querySelector('.form-page.active');
    if (currentPageEl) {
        currentPageEl.classList.remove('active');
    }

    // Show target page
    const targetPageEl = document.querySelector(`.form-page[data-page="${pageNumber}"]`);
    if (targetPageEl) {
        targetPageEl.classList.add('active');
    }

    // Update state
    state.currentPage = pageNumber;

    // Update progress bar
    updateProgressBar();

    // Update navigation buttons
    updateNavigationButtons();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Calculate progress percentage
    const progressPercent = ((state.currentPage - 1) / (state.totalPages - 1)) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Update step states
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNumber === state.currentPage) {
            step.classList.add('active');
        } else if (stepNumber < state.currentPage) {
            step.classList.add('completed');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Show/hide previous button
    prevBtn.style.display = state.currentPage > 1 ? 'inline-flex' : 'none';

    // Update next button text
    if (state.currentPage === state.totalPages) {
        nextBtn.textContent = '✓ Complete';
        nextBtn.classList.add('btn-success');
        nextBtn.classList.remove('btn-primary');
    } else {
        nextBtn.textContent = 'Next →';
        nextBtn.classList.add('btn-primary');
        nextBtn.classList.remove('btn-success');
    }
}


// ============================================
// Experience Section
// ============================================
function addExperienceSection() {
    const container = document.getElementById('experienceContainer');
    const index = state.experiences.length;

    const section = document.createElement('div');
    section.className = 'dynamic-section';
    section.dataset.index = index;

    section.innerHTML = `
        <button type="button" class="btn btn-icon btn-danger btn-small remove-btn" onclick="removeExperience(${index})">
            ✕
        </button>
        
        <div class="form-group">
            <label class="form-label">Job Title</label>
            <input type="text" class="form-input exp-title" placeholder="Senior Developer" data-index="${index}">
        </div>
        
        <div class="form-group">
            <label class="form-label">Company</label>
            <input type="text" class="form-input exp-company" placeholder="Tech Corp" data-index="${index}">
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="text" class="form-input exp-start" placeholder="Jan 2020" data-index="${index}">
            </div>
            <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="text" class="form-input exp-end" placeholder="Present" data-index="${index}">
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea exp-description" placeholder="Key responsibilities and achievements..." data-index="${index}"></textarea>
        </div>
    `;

    container.appendChild(section);

    // Add event listeners for real-time update
    section.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => updateExperience(index));
    });

    state.experiences.push({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
    });
}

function updateExperience(index) {
    const section = document.querySelector(`.dynamic-section[data-index="${index}"]`);
    if (!section) return;

    state.experiences[index] = {
        title: section.querySelector('.exp-title').value,
        company: section.querySelector('.exp-company').value,
        startDate: section.querySelector('.exp-start').value,
        endDate: section.querySelector('.exp-end').value,
        description: section.querySelector('.exp-description').value
    };

    updatePreview();
}

function removeExperience(index) {
    const section = document.querySelector(`#experienceContainer .dynamic-section[data-index="${index}"]`);
    if (section) {
        section.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            section.remove();
            state.experiences[index] = null;
            updatePreview();
        }, 300);
    }
}

// ============================================
// Education Section
// ============================================
function addEducationSection() {
    const container = document.getElementById('educationContainer');
    const index = state.education.length;

    const section = document.createElement('div');
    section.className = 'dynamic-section';
    section.dataset.index = index;

    section.innerHTML = `
        <button type="button" class="btn btn-icon btn-danger btn-small remove-btn" onclick="removeEducation(${index})">
            ✕
        </button>
        
        <div class="form-group">
            <label class="form-label">Degree</label>
            <input type="text" class="form-input edu-degree" placeholder="Bachelor of Science" data-index="${index}">
        </div>
        
        <div class="form-group">
            <label class="form-label">Institution</label>
            <input type="text" class="form-input edu-institution" placeholder="University Name" data-index="${index}">
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Start Date</label>
                <input type="text" class="form-input edu-start" placeholder="2016" data-index="${index}">
            </div>
            <div class="form-group">
                <label class="form-label">End Date</label>
                <input type="text" class="form-input edu-end" placeholder="2020" data-index="${index}">
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Description (Optional)</label>
            <textarea class="form-textarea edu-description" placeholder="GPA, honors, relevant coursework..." data-index="${index}"></textarea>
        </div>
    `;

    container.appendChild(section);

    // Add event listeners
    section.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => updateEducation(index));
    });

    state.education.push({
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
        description: ''
    });
}

function updateEducation(index) {
    const section = document.querySelector(`#educationContainer .dynamic-section[data-index="${index}"]`);
    if (!section) return;

    state.education[index] = {
        degree: section.querySelector('.edu-degree').value,
        institution: section.querySelector('.edu-institution').value,
        startDate: section.querySelector('.edu-start').value,
        endDate: section.querySelector('.edu-end').value,
        description: section.querySelector('.edu-description').value
    };

    updatePreview();
}

function removeEducation(index) {
    const section = document.querySelector(`#educationContainer .dynamic-section[data-index="${index}"]`);
    if (section) {
        section.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            section.remove();
            state.education[index] = null;
            updatePreview();
        }, 300);
    }
}

// ============================================
// Skills Management
// ============================================
function addSkill() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();

    if (skill && !state.skills.includes(skill)) {
        state.skills.push(skill);
        renderSkills();
        input.value = '';
        updatePreview();
    }
}

function removeSkill(skill) {
    const index = state.skills.indexOf(skill);
    if (index > -1) {
        state.skills.splice(index, 1);
        renderSkills();
        updatePreview();
    }
}

function renderSkills() {
    const container = document.getElementById('skillsContainer');
    container.innerHTML = state.skills.map(skill => `
        <div class="skill-tag">
            ${skill}
            <button onclick="removeSkill('${skill}')" type="button">✕</button>
        </div>
    `).join('');
}

// ============================================
// Preview Update
// ============================================
function updatePreview() {
    // Personal Info
    const fullName = document.getElementById('fullName').value || 'Your Name';
    const jobTitle = document.getElementById('jobTitle').value || 'Your Job Title';
    const email = document.getElementById('email').value || 'email@example.com';
    const phone = document.getElementById('phone').value || '+1 234 567 8900';
    const location = document.getElementById('location').value || 'Location';
    const website = document.getElementById('website').value || 'website.com';
    const summary = document.getElementById('summary').value;

    document.getElementById('previewName').textContent = fullName;
    document.getElementById('previewTitle').textContent = jobTitle;
    document.getElementById('previewEmail').textContent = email;
    document.getElementById('previewPhone').textContent = phone;
    document.getElementById('previewLocation').textContent = location;
    document.getElementById('previewWebsite').textContent = website;

    // Summary
    const summarySection = document.getElementById('previewSummarySection');
    if (summary) {
        document.getElementById('previewSummary').textContent = summary;
        summarySection.style.display = 'block';
    } else {
        summarySection.style.display = 'none';
    }

    // Experience
    const experienceSection = document.getElementById('previewExperienceSection');
    const experienceContainer = document.getElementById('previewExperience');
    const validExperiences = state.experiences.filter(exp => exp && (exp.title || exp.company));

    if (validExperiences.length > 0) {
        experienceContainer.innerHTML = validExperiences.map(exp => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <h3 class="cv-item-title">${exp.title || 'Job Title'}</h3>
                    <span class="cv-item-date">${exp.startDate} - ${exp.endDate}</span>
                </div>
                <p class="cv-item-subtitle">${exp.company || 'Company Name'}</p>
                ${exp.description ? `<p class="cv-item-description">${exp.description}</p>` : ''}
            </div>
        `).join('');
        experienceSection.style.display = 'block';
    } else {
        experienceSection.style.display = 'none';
    }

    // Education
    const educationSection = document.getElementById('previewEducationSection');
    const educationContainer = document.getElementById('previewEducation');
    const validEducation = state.education.filter(edu => edu && (edu.degree || edu.institution));

    if (validEducation.length > 0) {
        educationContainer.innerHTML = validEducation.map(edu => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <h3 class="cv-item-title">${edu.degree || 'Degree'}</h3>
                    <span class="cv-item-date">${edu.startDate} - ${edu.endDate}</span>
                </div>
                <p class="cv-item-subtitle">${edu.institution || 'Institution'}</p>
                ${edu.description ? `<p class="cv-item-description">${edu.description}</p>` : ''}
            </div>
        `).join('');
        educationSection.style.display = 'block';
    } else {
        educationSection.style.display = 'none';
    }

    // Skills
    const skillsSection = document.getElementById('previewSkillsSection');
    const skillsContainer = document.getElementById('previewSkills');

    if (state.skills.length > 0) {
        skillsContainer.innerHTML = state.skills.map(skill => `
            <span class="cv-skill">${skill}</span>
        `).join('');
        skillsSection.style.display = 'block';
    } else {
        skillsSection.style.display = 'none';
    }

    // Certifications
    const certifications = document.getElementById('certifications').value;
    const certificationsSection = document.getElementById('previewCertificationsSection');

    if (certifications) {
        document.getElementById('previewCertifications').innerHTML = certifications
            .split('\n')
            .filter(cert => cert.trim())
            .map(cert => `<p>• ${cert.trim()}</p>`)
            .join('');
        certificationsSection.style.display = 'block';
    } else {
        certificationsSection.style.display = 'none';
    }

    // Languages
    const languages = document.getElementById('languages').value;
    const languagesSection = document.getElementById('previewLanguagesSection');

    if (languages) {
        document.getElementById('previewLanguages').innerHTML = languages
            .split('\n')
            .filter(lang => lang.trim())
            .map(lang => `<p>• ${lang.trim()}</p>`)
            .join('');
        languagesSection.style.display = 'block';
    } else {
        languagesSection.style.display = 'none';
    }
}

// ============================================
// Template Management
// ============================================
function changeTemplate(template) {
    state.currentTemplate = template;

    // Update active state
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-template="${template}"]`).classList.add('active');

    // Update preview
    const preview = document.getElementById('cvPreview');
    preview.dataset.template = template;

    // Apply template-specific styles
    applyTemplateStyles(template);
}

function applyTemplateStyles(template) {
    const preview = document.getElementById('cvPreview');

    // Remove existing template classes
    preview.classList.remove('template-modern', 'template-classic', 'template-minimal');

    // Add new template class
    preview.classList.add(`template-${template}`);

    // Template-specific customizations can be added here
    switch (template) {
        case 'classic':
            preview.style.fontFamily = 'Georgia, serif';
            break;
        case 'minimal':
            preview.style.fontFamily = 'Arial, sans-serif';
            break;
        default:
            preview.style.fontFamily = 'Inter, sans-serif';
    }
}

// ============================================
// Data Persistence
// ============================================
function saveToLocalStorage() {
    const data = {
        personalInfo: {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            website: document.getElementById('website').value,
            summary: document.getElementById('summary').value,
            certifications: document.getElementById('certifications').value,
            languages: document.getElementById('languages').value
        },
        experiences: state.experiences.filter(exp => exp !== null),
        education: state.education.filter(edu => edu !== null),
        skills: state.skills,
        template: state.currentTemplate
    };

    localStorage.setItem('cvBuilderData', JSON.stringify(data));
    showNotification('✅ Data saved successfully!', 'success');
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('cvBuilderData');

    if (savedData) {
        try {
            const data = JSON.parse(savedData);

            // Load personal info
            if (data.personalInfo) {
                document.getElementById('fullName').value = data.personalInfo.fullName || '';
                document.getElementById('jobTitle').value = data.personalInfo.jobTitle || '';
                document.getElementById('email').value = data.personalInfo.email || '';
                document.getElementById('phone').value = data.personalInfo.phone || '';
                document.getElementById('location').value = data.personalInfo.location || '';
                document.getElementById('website').value = data.personalInfo.website || '';
                document.getElementById('summary').value = data.personalInfo.summary || '';
                document.getElementById('certifications').value = data.personalInfo.certifications || '';
                document.getElementById('languages').value = data.personalInfo.languages || '';
            }

            // Load experiences
            if (data.experiences && data.experiences.length > 0) {
                // Clear existing
                document.getElementById('experienceContainer').innerHTML = '';
                state.experiences = [];

                data.experiences.forEach((exp, index) => {
                    addExperienceSection();
                    const section = document.querySelector(`#experienceContainer .dynamic-section[data-index="${index}"]`);
                    if (section) {
                        section.querySelector('.exp-title').value = exp.title || '';
                        section.querySelector('.exp-company').value = exp.company || '';
                        section.querySelector('.exp-start').value = exp.startDate || '';
                        section.querySelector('.exp-end').value = exp.endDate || '';
                        section.querySelector('.exp-description').value = exp.description || '';
                        updateExperience(index);
                    }
                });
            }

            // Load education
            if (data.education && data.education.length > 0) {
                document.getElementById('educationContainer').innerHTML = '';
                state.education = [];

                data.education.forEach((edu, index) => {
                    addEducationSection();
                    const section = document.querySelector(`#educationContainer .dynamic-section[data-index="${index}"]`);
                    if (section) {
                        section.querySelector('.edu-degree').value = edu.degree || '';
                        section.querySelector('.edu-institution').value = edu.institution || '';
                        section.querySelector('.edu-start').value = edu.startDate || '';
                        section.querySelector('.edu-end').value = edu.endDate || '';
                        section.querySelector('.edu-description').value = edu.description || '';
                        updateEducation(index);
                    }
                });
            }

            // Load skills
            if (data.skills) {
                state.skills = data.skills;
                renderSkills();
            }

            // Load template
            if (data.template) {
                changeTemplate(data.template);
            }

            updatePreview();
            showNotification('✅ Data loaded successfully!', 'success');
        } catch (error) {
            console.error('Error loading data:', error);
            showNotification('❌ Error loading data', 'error');
        }
    } else {
        showNotification('ℹ️ No saved data found', 'info');
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.removeItem('cvBuilderData');
        location.reload();
    }
}

// ============================================
// Export to PDF
// ============================================
function exportToPDF() {
    showNotification('📄 Generating PDF...', 'info');

    // Get the CV name for the filename
    const cvName = document.getElementById('fullName').value || 'CV';
    const filename = `${cvName.replace(/\s+/g, '_')}_Resume.pdf`;

    // Get the preview element
    const element = document.getElementById('cvPreview');

    // Configure PDF options
    const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    // Generate and download PDF
    html2pdf().set(opt).from(element).save().then(() => {
        showNotification('✅ PDF downloaded successfully!', 'success');
    }).catch((error) => {
        console.error('PDF generation error:', error);
        showNotification('❌ Error generating PDF', 'error');
    });
}

// ============================================
// Theme Toggle
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const button = document.getElementById('themeToggle');

    html.setAttribute('data-theme', newTheme);
    button.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// ============================================
// Notifications
// ============================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(style);
