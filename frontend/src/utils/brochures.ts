// Import all brochure images
import brochure1 from '../assets/shell/1.png';
import brochure2 from '../assets/shell/2.png';
import brochure3 from '../assets/shell/3.png';
import brochure4 from '../assets/shell/4.png';
import brochure5 from '../assets/shell/5.png';
import brochure6 from '../assets/shell/6.png';
import brochure7 from '../assets/shell/7.png';

export interface Brochure {
  id: number;
  name: string;
  filename: string;
  description: string;
  imageUrl: string;
}

export const brochures: Brochure[] = [
  { 
    id: 1, 
    name: 'Shell Academy', 
    filename: '1.png', 
    description: 'Introduction to Shell Academy and our learning platform',
    imageUrl: brochure1
  },
  { 
    id: 2, 
    name: 'About the Company', 
    filename: '2.png', 
    description: 'Learn about Shell company history, values, and mission',
    imageUrl: brochure2
  },
  { 
    id: 3, 
    name: 'More Details', 
    filename: '3.png', 
    description: 'Comprehensive course details and learning outcomes',
    imageUrl: brochure3
  },
  { 
    id: 4, 
    name: 'Key Highlights', 
    filename: '4.png', 
    description: 'Important course features and key learning points',
    imageUrl: brochure4
  },
  { 
    id: 5, 
    name: 'Course Syllabus', 
    filename: '5.png', 
    description: 'Complete course syllabus and curriculum structure',
    imageUrl: brochure5
  },
  { 
    id: 6, 
    name: 'Certificate and Recognition', 
    filename: '6.png', 
    description: 'Information about course completion certificates',
    imageUrl: brochure6
  },
  { 
    id: 7, 
    name: 'Additional Certificate', 
    filename: '7.png', 
    description: 'Additional certification opportunities and recognition',
    imageUrl: brochure7
  }
];

export const downloadBrochure = (brochure: Brochure): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const link = document.createElement('a');
      link.href = brochure.imageUrl;
      link.download = `${brochure.name.replace(/\s+/g, '_')}_${brochure.filename}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve(true);
    } catch (error) {
      console.error('Download error:', error);
      resolve(false);
    }
  });
};

export const downloadAllBrochures = async (): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < brochures.length; i++) {
    const brochure = brochures[i];
    await new Promise(resolve => setTimeout(resolve, i * 300)); // Stagger downloads
    const result = await downloadBrochure(brochure);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }
  
  return { success, failed };
};