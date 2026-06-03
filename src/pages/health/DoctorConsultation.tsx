import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Save, Pill, FileText, UserCircle, Loader2 } from 'lucide-react';

const DoctorConsultation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [appointment, setAppointment] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Call controls
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  
  // Notes & Prescription State
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [medication, setMedication] = useState({ name: '', dosage: '', frequency: '', duration: '' });
  const [prescribing, setPrescribing] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const { data: appt, error: apptError } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', id)
          .single();

        if (apptError) throw apptError;
        setAppointment(appt);
        setNotes(appt.notes || '');

        if (appt.patient_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', appt.patient_id)
            .single();
          setPatient(profile);
        }
      } catch (error) {
        console.error('Error fetching consultation:', error);
        toast({ title: 'Error', description: 'Could not load consultation room', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Notes Saved' });
    } catch (error) {
      toast({ title: 'Error saving notes', variant: 'destructive' });
    } finally {
      setSavingNotes(false);
    }
  };

  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !appointment) return;
    
    setPrescribing(true);
    try {
      const medsArray = [medication]; // Simplification for demo
      
      const { error } = await supabase
        .from('prescriptions')
        .insert({
          appointment_id: appointment.id,
          patient_id: appointment.patient_id,
          doctor_id: user.id,
          medications: medsArray,
          instructions: notes
        });

      if (error) throw error;
      
      toast({ title: 'Prescription Sent!' });
      setShowPrescription(false);
      setMedication({ name: '', dosage: '', frequency: '', duration: '' });
    } catch (error: any) {
      toast({ title: 'Prescription Failed', description: error.message, variant: 'destructive' });
    } finally {
      setPrescribing(false);
    }
  };

  const endConsultation = async () => {
    try {
      await handleSaveNotes();
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Consultation Ended Successfully' });
      navigate('/doctor-dashboard');
    } catch (error) {
      toast({ title: 'Error ending consultation', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Video Call Section (Left Column, takes 2/3 width) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-muted-foreground" />
              Patient: {patient?.full_name || 'Unknown'}
            </h2>
            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Badge variant="outline" className={appointment?.status === 'scheduled' ? 'text-green-600 bg-green-50' : ''}>
                {appointment?.status.toUpperCase()}
              </Badge>
              <span>{appointment?.appointment_time}</span>
            </div>
          </div>
          <Button variant="destructive" onClick={endConsultation}>
            <PhoneOff className="h-4 w-4 mr-2" />
            End Call
          </Button>
        </div>

        {/* Video Player Placeholder */}
        <div className="flex-1 bg-black rounded-xl overflow-hidden relative shadow-lg min-h-[400px]">
          {videoOn ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" 
                alt="Patient video feed" 
                className="w-full h-full object-cover opacity-60"
              />
              <span className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
                {patient?.full_name}
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
              <UserCircle className="h-24 w-24 text-zinc-700" />
              <span className="text-zinc-500">Patient video paused</span>
            </div>
          )}
          
          {/* Picture in Picture (Doctor Self view) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-zinc-800 rounded-lg border-2 border-white/20 overflow-hidden shadow-2xl">
             <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-xs">
               Doctor Camera Active
             </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            <Button 
              variant={micOn ? "secondary" : "destructive"} 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? <Mic /> : <MicOff />}
            </Button>
            <Button 
              variant={videoOn ? "secondary" : "destructive"} 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={() => setVideoOn(!videoOn)}
            >
              {videoOn ? <Video /> : <VideoOff />}
            </Button>
            <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={endConsultation}>
              <PhoneOff />
            </Button>
          </div>
        </div>
      </div>

      {/* Clinical Sidebar (Right Column) */}
      <div className="flex flex-col gap-4">
        
        {/* Symptoms / History */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-md flex items-center gap-2">
              <FileText className="h-4 w-4 text-healthcare" />
              Chief Complaint
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground pb-4">
            {appointment?.symptoms || 'No symptoms provided.'}
          </CardContent>
        </Card>

        {/* Clinical Notes */}
        <Card className="flex-1 flex flex-col min-h-[300px]">
          <CardHeader className="py-4 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-md flex items-center gap-2">
                <FileText className="h-4 w-4 text-healthcare" />
                Clinical Notes
              </CardTitle>
              <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={savingNotes}>
                {savingNotes ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your diagnosis, observations, and advice here..."
              className="h-full border-0 resize-none focus-visible:ring-0 rounded-none p-4"
            />
          </CardContent>
        </Card>

        {/* Prescription Action */}
        <Card>
          <CardContent className="p-4">
            {showPrescription ? (
              <form onSubmit={handlePrescribe} className="space-y-3">
                <h4 className="font-semibold text-sm border-b pb-2 mb-2">E-Prescribe Medication</h4>
                <div className="space-y-2">
                  <Label className="text-xs">Medication Name</Label>
                  <Input required size={1} className="h-8 text-sm" value={medication.name} onChange={e => setMedication({...medication, name: e.target.value})} placeholder="e.g. Amoxicillin 500mg" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Frequency</Label>
                    <Input required size={1} className="h-8 text-sm" value={medication.frequency} onChange={e => setMedication({...medication, frequency: e.target.value})} placeholder="1-0-1" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Duration</Label>
                    <Input required size={1} className="h-8 text-sm" value={medication.duration} onChange={e => setMedication({...medication, duration: e.target.value})} placeholder="5 days" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={() => setShowPrescription(false)}>Cancel</Button>
                  <Button type="submit" size="sm" className="flex-1 bg-healthcare hover:bg-healthcare/90" disabled={prescribing}>
                    {prescribing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Send'}
                  </Button>
                </div>
              </form>
            ) : (
              <Button 
                variant="outline" 
                className="w-full text-healthcare border-healthcare/20 hover:bg-healthcare/5"
                onClick={() => setShowPrescription(true)}
              >
                <Pill className="h-4 w-4 mr-2" />
                Write Prescription
              </Button>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DoctorConsultation;
