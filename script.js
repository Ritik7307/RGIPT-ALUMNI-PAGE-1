
        document.addEventListener('DOMContentLoaded', function () {
            // --- Mobile Menu Toggle ---
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // --- Image Slider Logic ---
            let currentSlide = 0;
            const slides = document.querySelectorAll('.slider-image');
            const slideCount = slides.length;

            function showSlide(n) {
                slides.forEach(slide => slide.classList.remove('active'));
                if (slides[n]) {
                    slides[n].classList.add('active');
                }
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % slideCount;
                showSlide(currentSlide);
            }
            
            if (slideCount > 0) {
                setInterval(nextSlide, 4000); // Change image every 4 seconds
            }

            // --- Page Navigation Logic ---
            const navLinks = document.querySelectorAll('.nav-link');
            const pages = document.querySelectorAll('.page-content');

            function showPage(pageId) {
                pages.forEach(page => {
                    if (page.id === pageId) {
                        page.classList.remove('hidden');
                    } else {
                        page.classList.add('hidden');
                    }
                });
                window.scrollTo(0, 0);
                // Close mobile menu after navigation
                mobileMenu.classList.add('hidden');
            }

            navLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    if(pageId) {
                        showPage(pageId);
                    }
                });
            });

            // --- Committee Tab Logic ---
            const associationBtn = document.getElementById('association-btn');
            const affairBtn = document.getElementById('affair-btn');
            const associationContent = document.getElementById('association-content');
            const affairContent = document.getElementById('affair-content');

            if (associationBtn) {
                associationBtn.addEventListener('click', () => {
                    associationBtn.classList.add('border-b-4', 'border-sky-600', 'text-sky-600');
                    associationBtn.classList.remove('text-gray-500');
                    affairBtn.classList.remove('border-b-4', 'border-sky-600', 'text-sky-600');
                    affairBtn.classList.add('text-gray-500');
                    associationContent.classList.remove('hidden');
                    affairContent.classList.add('hidden');
                });
                affairBtn.addEventListener('click', () => {
                    affairBtn.classList.add('border-b-4', 'border-sky-600', 'text-sky-600');
                    affairBtn.classList.remove('text-gray-500');
                    associationBtn.classList.remove('border-b-4', 'border-sky-600', 'text-sky-600');
                    associationBtn.classList.add('text-gray-500');
                    affairContent.classList.remove('hidden');
                    associationContent.classList.add('hidden');
                });
            }
            
            // --- Contribution Form Logic ---
            const donationTypeRadios = document.querySelectorAll('input[name="donationType"]');
            const nameFieldGroup = document.getElementById('name-field-group');
            const batchFieldGroup = document.getElementById('batch-field-group');
            const nameInput = document.getElementById('full-name');
            const batchInput = document.getElementById('batch');
            const anonymousNote = document.getElementById('anonymous-note');

            function toggleAnonymousFields() {
                const selectedValue = document.querySelector('input[name="donationType"]:checked').value;
                const isAnonymous = selectedValue === 'anonymous';
                nameFieldGroup.classList.toggle('field-hidden', isAnonymous);
                batchFieldGroup.classList.toggle('field-hidden', isAnonymous);
                if (nameInput) nameInput.required = !isAnonymous;
                if (batchInput) batchInput.required = !isAnonymous;
                if (anonymousNote) anonymousNote.classList.toggle('hidden', !isAnonymous);
            }

            donationTypeRadios.forEach(radio => {
                radio.addEventListener('change', toggleAnonymousFields);
            });
            toggleAnonymousFields(); // Initial call

            const form = document.getElementById('contribution-form-element');
            if (form) {
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    if (form.checkValidity()) {
                        try {
                            const formData = {
                                donationType: document.querySelector('input[name="donationType"]:checked').value,
                                transactionId: document.getElementById('transaction-id').value,
                                amount: parseFloat(document.getElementById('amount').value),
                                designatedFund: document.getElementById('designated-fund').value || 'general',
                                fullName: document.getElementById('full-name').value || '',
                                phone: document.getElementById('phone').value,
                                email: document.getElementById('email-personal').value,
                                pan: document.getElementById('pan').value || '',
                                batch: document.getElementById('batch').value || '',
                                branch: document.getElementById('branch-form').value,
                                employer: document.getElementById('employer').value || '',
                                suggestions: document.getElementById('suggestions').value || '',
                                mailingList: document.getElementById('mailing-list').checked
                            };

                            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
                            const response = await fetch(`${apiUrl}/api/contribution/submit`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(formData)
                            });

                            const result = await response.json();

                            if (response.ok) {
                                alert('Thank you for your generous contribution to RGIPT! Your support truly makes a difference. A confirmation email has been sent to your email address.');
                                form.reset();
                                setTimeout(toggleAnonymousFields, 0);
                            } else {
                                alert('Error: ' + result.error);
                            }
                        } catch (error) {
                            console.error('Error submitting contribution:', error);
                            alert('There was an error submitting your contribution. Please try again later.');
                        }
                    } else {
                        form.reportValidity();
                    }
                });

                form.addEventListener('reset', () => {
                    setTimeout(toggleAnonymousFields, 0);
                });
            }


            // Show home page by default
            showPage('home');
        });

        function alumniDirectory() {
            // AlpineJS function for directory
            return {
                isModalOpen: false,
                photoPreviewUrl: null,
                photoFile: null,
                isLoading: false,
                newAlumnus: { name: '', email: '', passingYear: '', branch: '', linkedin: '', photoFile: null },
                alumni: [],
                async init() {
                    // Fetch alumni from backend
                    try {
                        const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
                        const response = await fetch(`${apiUrl}/api/alumni`);
                        const data = await response.json();
                        this.alumni = data;
                    } catch (error) {
                        console.error('Error fetching alumni:', error);
                    }
                },
                handlePhotoChange(event) {
                    const file = event.target.files[0];
                    if (file) {
                        this.photoFile = file;
                        this.photoPreviewUrl = URL.createObjectURL(file);
                    }
                },
                async handleSubmit() {
                    if (this.isLoading) return;
                    this.isLoading = true;

                    try {
                        const formData = new FormData();
                        formData.append('name', this.newAlumnus.name);
                        formData.append('email', this.newAlumnus.email);
                        formData.append('passingYear', this.newAlumnus.passingYear);
                        formData.append('branch', this.newAlumnus.branch);
                        formData.append('linkedin', this.newAlumnus.linkedin);
                        if (this.photoFile) {
                            formData.append('photo', this.photoFile);
                        }

                        const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
                        const response = await fetch(`${apiUrl}/api/alumni/register`, {
                            method: 'POST',
                            body: formData
                        });

                        const result = await response.json();

                        if (response.ok) {
                            alert('Registration successful! Please check your email for confirmation. Your profile will be visible once verified by our admin team.');
                            this.isModalOpen = false;
                            this.newAlumnus = { name: '', email: '', passingYear: '', branch: '', linkedin: '', photoFile: null };
                            this.photoPreviewUrl = null;
                            this.photoFile = null;
                            // Reload alumni list
                            await this.init();
                        } else {
                            alert('Error: ' + result.error);
                        }
                    } catch (error) {
                        console.error('Error submitting alumni registration:', error);
                        alert('There was an error submitting your registration. Please try again later.');
                    } finally {
                        this.isLoading = false;
                    }
                }
            }
        }
  