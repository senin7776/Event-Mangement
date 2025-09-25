import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  venue: string;
  registrationDeadline: string;
  maxParticipants: number;
  registrationFee?: number;
  description: string;
  poster?: string;
  organizer: string;
  registeredCount: number;
}

export interface Registration {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  tshirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  medicalConditions?: string;
  hearAboutUs: string;
  eventType: EventType;
  emergencyContact: string;
  pincode: string;
  address: string;
  registrationDate: string;
}

export type EventType = 'Marathon' | 'Cycling' | 'Walkathon' | 'Yoga' | 'Zumba' | 'Swimming' | 'Hiking';

export interface EventState {
  events: Event[];
  registrations: Registration[];
  currentUser: {
    phone?: string;
    isVerified: boolean;
  };
  otp: {
    code: string;
    expiry: number;
    isVerified: boolean;
  };
}

type EventAction =
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_REGISTRATION'; payload: Registration }
  | { type: 'GENERATE_OTP'; payload: { phone: string } }
  | { type: 'VERIFY_OTP'; payload: { code: string } }
  | { type: 'RESET_OTP' }
  | { type: 'LOAD_DATA' };

const initialState: EventState = {
  events: [
    {
      id: '1',
      title: 'Mumbai Marathon 2024',
      type: 'Marathon',
      date: '2024-01-21',
      time: '06:00',
      venue: 'Marine Drive, Mumbai',
      registrationDeadline: '2024-01-15',
      maxParticipants: 5000,
      registrationFee: 1500,
      description: 'Join thousands of runners in Mumbai\'s biggest marathon event. Experience the thrill of running through the heart of the city.',
      organizer: 'Mumbai Marathon Committee',
      registeredCount: 3245,
    },
    {
      id: '2',
      title: 'Sunrise Yoga Session',
      type: 'Yoga',
      date: '2024-01-15',
      time: '06:30',
      venue: 'Juhu Beach, Mumbai',
      registrationDeadline: '2024-01-14',
      maxParticipants: 100,
      description: 'Start your day with peaceful yoga by the beach. All levels welcome.',
      organizer: 'Wellness Mumbai',
      registeredCount: 67,
    },
    {
      id: '3',
      title: 'Cycling Championship',
      type: 'Cycling',
      date: '2024-01-28',
      time: '07:00',
      venue: 'Powai Lake Circuit',
      registrationDeadline: '2024-01-25',
      maxParticipants: 200,
      registrationFee: 800,
      description: 'Competitive cycling race around the scenic Powai Lake. Bring your own bicycle.',
      organizer: 'Mumbai Cycling Club',
      registeredCount: 124,
    },
  ],
  registrations: [],
  currentUser: {
    isVerified: false,
  },
  otp: {
    code: '',
    expiry: 0,
    isVerified: false,
  },
};

const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    
    case 'ADD_REGISTRATION':
      const updatedEvents = state.events.map(event =>
        event.id === action.payload.eventId
          ? { ...event, registeredCount: event.registeredCount + 1 }
          : event
      );
      
      return {
        ...state,
        registrations: [...state.registrations, action.payload],
        events: updatedEvents,
      };
    
    case 'GENERATE_OTP':
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          phone: action.payload.phone,
        },
        otp: {
          code: otpCode,
          expiry: Date.now() + 300000, // 5 minutes
          isVerified: false,
        },
      };
    
    case 'VERIFY_OTP':
      const isValid = action.payload.code === state.otp.code && Date.now() < state.otp.expiry;
      return {
        ...state,
        otp: {
          ...state.otp,
          isVerified: isValid,
        },
        currentUser: {
          ...state.currentUser,
          isVerified: isValid,
        },
      };
    
    case 'RESET_OTP':
      return {
        ...state,
        otp: {
          code: '',
          expiry: 0,
          isVerified: false,
        },
        currentUser: {
          ...state.currentUser,
          isVerified: false,
        },
      };
    
    case 'LOAD_DATA':
      // Load from localStorage in real app
      return state;
    
    default:
      return state;
  }
};

const EventContext = createContext<{
  state: EventState;
  dispatch: React.Dispatch<EventAction>;
} | null>(null);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};